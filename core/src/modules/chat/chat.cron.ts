import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'providers/RedisClient';
import { TelegramAPI } from 'providers/Telegram';
import { MyLogger } from 'config/MyLogger';
import { QdrantProvider } from 'providers/QdrantClient';
import { YandexMLProvider } from 'providers/YandexML';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { DialogData, DialogDataDocument } from '../../schemas/dialogData.scheme';
import { Model } from 'mongoose';
import { DialogStats, DialogStatsDocument } from '../../schemas/dialogStats.scheme';
import { getMessagesScheme } from '../dialogsData/utils/getMessagesScheme';
import { ME_USER_ID } from '../dialogsData/dialogsData.service';
import { chainToVectorData } from '../dialogsData/utils/chainToVectorData';
import PQueue from '@esm2cjs/p-queue';
import { PERSON_DIALOGS_COLLECTION } from 'common/const/VECTOR_COLLECTIONS_NAMES';
import { v4 as uuidv4 } from 'uuid';
import { MessageQueue, MessageQueueDocument } from '../../schemas/messageQueue.scheme';
import { differenceInSeconds } from 'date-fns';
import {ChatService} from "./chat.service";

@Injectable()
export class ChatCronService {
    constructor(
        @Inject(forwardRef(() => MyLogger))
        private readonly logger: MyLogger,
        @Inject(forwardRef(() => QdrantProvider))
        private readonly qdrantProvider: QdrantProvider,
        @Inject(forwardRef(() => YandexMLProvider))
        private readonly yandexML: YandexMLProvider,
        @InjectModel(DialogData.name)
        private dialogDataModel: Model<DialogDataDocument>,
        @InjectModel(DialogStats.name)
        private dialogStatsModel: Model<DialogStatsDocument>,
        @InjectModel(MessageQueue.name)
        private messageQueueModel: Model<MessageQueueDocument>,
        @Inject(forwardRef(() => ChatService))
        private readonly chatService: ChatService,
    ){}

    @Cron(CronExpression.EVERY_5_SECONDS)
    async fetchMessages() {
        const currentMessages = await this.messageQueueModel.find().sort({
            createdAt: -1,
        });

        const lastMessage = currentMessages?.[0];

        if (lastMessage) {
            const lastMessageDate = lastMessage.createdAt;
            const diffFromNow = differenceInSeconds(new Date(), lastMessageDate);

            if (diffFromNow > 20) {
                const resultMessage = currentMessages.map((m) => m.text).reverse().join(' ');
                const chatId = +lastMessage.chatId;

                await this.messageQueueModel.deleteMany({});

                await this.chatService.onBotMessageReceived({
                    text: resultMessage,
                    chatId,
                });
            }
        }
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async handleIndexPerson() {
        const notIndexed = await this.dialogStatsModel.findOne({
            isSelected: true,
            isStartIndexing: false,
            isIndexed: false,
        });

        if (notIndexed) {
            const notIndexedData = await this.dialogDataModel.findOne({
                _id: notIndexed.dialogDataId,
            });

            if (!notIndexedData) {
                return;
            }

            await this.dialogStatsModel.updateOne({
                _id: notIndexed._id,
            }, {
                isStartIndexing: true,
            });

            const chains = getMessagesScheme({
                messages: notIndexedData.messages,
                isJoinGroup: true,
                me_id: ME_USER_ID,
            });

            const vectorDocs = chains.map((c) => c.messages.map((m) =>  chainToVectorData(m)));

            const queue = new PQueue({ concurrency: 5 });
            let indexNumber = 0;

            const llmPromises = vectorDocs.map(doc =>
                queue.add(async () => {
                    try {

                        const docText = doc.join('\n');

                        this.logger.log(`indexed ${++indexNumber}`);

                        const embeddingsResult = await this.yandexML.embeddings.embedQuery(docText);

                        await this.qdrantProvider.client.upsert(PERSON_DIALOGS_COLLECTION({
                            personId: notIndexed.personId,
                        }), {
                            points: [{
                                id: uuidv4(),
                                payload: {
                                    text: docText,
                                },
                                vector: embeddingsResult,
                            }],
                        });
                        
                    } catch (e) {
                        this.logger.error(`failed to index ${++indexNumber}`, e);
                    }
                    return '';
                }),
            );

            await Promise.all(llmPromises);

            await this.dialogStatsModel.updateOne({
                _id: notIndexed._id,
            }, {
                isIndexed: true,
            });
        }

    }
}
