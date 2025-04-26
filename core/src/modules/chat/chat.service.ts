import { ChatEngine } from './utils/ChatEngine';
import { SendMessageBody } from './requests/sendMessage.request';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'providers/RedisClient';
import { ChatOpenAI } from '@langchain/openai';
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models';
import { vars } from '../../config/vars';
import { LangChainChatEngine } from './utils/LangChainChatEngine';
import { FineTunedModels } from './utils/LLMEngine';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import TelegramBot = require('node-telegram-bot-api')
import { TelegramAPI } from 'providers/Telegram';
import { MyLogger } from 'config/MyLogger';
import { QdrantProvider } from 'providers/QdrantClient';
import { USER_KNOWLEDGE_COLLECTION } from '../../common/const/VECTOR_COLLECTIONS_NAMES';
import { YandexMLProvider } from 'providers/YandexML';

@Injectable()
export class ChatService {
    constructor(
        @Inject(RedisClient)
        private readonly redisClient: RedisClient,
        @Inject(forwardRef(() => TelegramAPI))
        private readonly telegram: TelegramAPI,
        @Inject(forwardRef(() => MyLogger))
        private readonly logger: MyLogger,
        @Inject(forwardRef(() => QdrantProvider))
        private readonly qdrantProvider: QdrantProvider,
        @Inject(forwardRef(() => YandexMLProvider))
        private readonly yandexML: YandexMLProvider,
    ){}
    
    llm:BaseChatModel;
    chatEngine:ChatEngine;
    
    async sendMessage(body:SendMessageBody):Promise<any> {
        const queryInfo = await this.getQueryInfo(body.text);

        this.llm = new ChatOpenAI({
            configuration: {
                baseURL: vars.nebius.baseUrl,
                apiKey: vars.nebius.secretKey,
            },
            model: FineTunedModels.BashirLlama70b,
            temperature: 0.8,
            topP: 0.9,
        });

        const chain =  new LangChainChatEngine({
            llm: this.llm,
            sessionId: body.sessionId,
        });

        const res1 = await chain.invoke({ content: body.text });

        return {
            response: res1,
        };
    }

    private async getQueryInfo(qyery:string):Promise<string[]> {
        const queryVector = await this.yandexML.embeddings.embedQuery(qyery);

        const result = await this.qdrantProvider.client.query(USER_KNOWLEDGE_COLLECTION({
            userId: '67eeea33e6ac1b5cb2158eea',
        }), {
            query: queryVector,
            params: {
                hnsw_ef: 128,
                exact: false,
            },
            with_payload: true,
            limit: 3,
        });

        return [];
    }

    async onBotMessageReceived(message:TelegramBot.Message):Promise<void> {
        if (!message.from?.id || !message.text) {
            return;
        }

        this.logger.log('Received text message from bot:', message);

        this.llm = new ChatOpenAI({
            configuration: {
                baseURL: vars.nebius.baseUrl,
                apiKey: vars.nebius.secretKey,
            },
            model: FineTunedModels.BashirLlama70b,
            temperature: 0.8,
            topP: 0.9,
        });

        const chain =  new LangChainChatEngine({
            llm: this.llm,
            sessionId: message.from.id.toString(),
        });

        const res1 = await chain.invoke({ content: message.text });

        await this.telegram.client.sendMessage(message.chat.id, res1.response);
    }
}
