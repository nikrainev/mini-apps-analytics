import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UploadFileBody, UploadFileRes } from './requests/uploadFile.request';
import { forwardRef, Inject } from '@nestjs/common';
import { YandexMLProvider } from 'providers/YandexML';
import { clearTgMessageData } from './utils/clearTgMessageData';
import { DialogData, DialogDataDocument } from 'schemas/dialogData.scheme';
import {
    DialogStats,
    DialogStatsDocument,
    IMessagesCountStat,
    IMessagesTimeStat, ISchemeStat,
} from 'schemas/dialogStats.scheme';
import { countMessages } from './queries/countMessages';
import { countMessagesTime } from './queries/countMessagesTime';
import { getMessagesScheme, SourceMessage } from './utils/getMessagesScheme';
import {calculateAverageOfSegments} from "./utils/calculateAverageOfSegments";

const ME_USER_ID = 'user287716767';

export class DialogsDataService {
    constructor(
        @InjectModel(DialogData.name)
        private dialogDataModel: Model<DialogDataDocument>,
        @InjectModel(DialogStats.name)
        private dialogStatsModel: Model<DialogStatsDocument>,
        @Inject(forwardRef(() => YandexMLProvider))
        private readonly yandexML: YandexMLProvider,
    ) {}

    async uploadFile(personId:string, meUserId:string, body:UploadFileBody):Promise<UploadFileRes> {
        const fileText = body.file.buffer.toString();

        const result = clearTgMessageData(JSON.parse(fileText));

        const now = new Date();

        const newDialogData = new this.dialogDataModel({
            ownerUserId: meUserId,
            messages: result.messages,
            createdAt: now,
        });

        await newDialogData.save();

        const messagesCount = await this.countMessages(newDialogData._id);
        const messagesData = await this.countMessagesTime(newDialogData._id);
        const schemeStat = this.getSchemeStats(newDialogData.messages);

        const newDialogStatsModel = new this.dialogStatsModel({
            title: body.title,
            dialogTitle: result.name,
            ownerUserId: meUserId,
            countStat: messagesCount,
            timeStat: messagesData,
            schemeStat,
            dialogDataId: newDialogData._id.toString(),
            createdAt: now,
        });

        await newDialogStatsModel.save();

        return {
            personId,
            fileText: [fileText],
        };
    }

    private async countMessages(dialogDataId:Types.ObjectId):Promise<IMessagesCountStat> {
        const result = await this.dialogDataModel.aggregate(countMessages({
            dataId: dialogDataId,
        }));

        const meData = result.find((r) => r._id === ME_USER_ID);
        const otherData = result.find((r) => r._id && r._id !== ME_USER_ID);

        const meTotalMessages = meData?.totalMessages || 0;
        const meMessageAvgLen = meData ? meData.messageLen / meData.totalMessages : 0;
        const otherTotalMessages = otherData?.totalMessages || 0;
        const otherMessageAvgLen = otherData ? otherData.messageLen / otherData.totalMessages : 0;

        return {
            myCount: meTotalMessages,
            avgMeLength: meMessageAvgLen,
            otherCount: otherTotalMessages,
            avgOtherLength: otherMessageAvgLen,
        };
    }

    private async countMessagesTime(dialogDataId:Types.ObjectId):Promise<IMessagesTimeStat> {
        const result = await this.dialogDataModel.aggregate(countMessagesTime({
            dataId: dialogDataId,
        }));

        const weekDays = [0, 0, 0, 0, 0, 0, 0];
        const hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        result.filter((r) => r.fromId === ME_USER_ID).forEach((r) => {
            weekDays[r.dayOfWeek - 1] = weekDays[r.dayOfWeek - 1] + r.count;
            hours[r.hour] = hours[r.hour] + r.count;
        });

        const maxHour = Math.max(...hours) || 1;
        const maxDay = Math.max(...weekDays) || 1;

        return {
            weekDays: weekDays.map((d) => d / maxDay),
            hours: hours.map((h) => h / maxHour),
        };
    }

    private getSchemeStats(messages:SourceMessage[]):ISchemeStat {
        const chains = getMessagesScheme({
            messages,
            me_id: ME_USER_ID,
        });

        const meStart = chains.filter((c) => c.messages[0]?.role === 'assistant').length || 0;
        const meStartRation = meStart / chains.length;
        const chainSizes = chains.map((c) => c.messages.length);
        const messageGroupSize = chains.map((c) => {
            const result:number[] = [];
            let index = 0;

            c.messages.forEach((m) => {
                if (m.role === 'assistant') {
                    result[index] = (result[index] || 0) + 1;
                } else if (result[index]) {
                    index++;
                }
            });

            return result;
        }).flat();
        
        const responseTime:number[] = [];
        const messageSize:number[] = [];

        return {
            responseTime,
            messageSize,
            messageGroupSize: calculateAverageOfSegments(messageGroupSize, 10),
            messageChainSize: calculateAverageOfSegments(chainSizes, 10),
            chainStart: {
                me: meStartRation,
                other: 1 - meStartRation,
            },
        };
    }
}
