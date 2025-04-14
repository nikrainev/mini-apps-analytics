import { ChatEngine } from './utils/ChatEngine';
import { SendMessageBody } from './requests/sendMessage.request';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import { RedisClient } from 'providers/RedisClient';
import { ChatOpenAI } from '@langchain/openai';
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models';
import { vars } from '../../config/vars';
import { LangChainChatEngine } from './utils/LangChainChatEngine';
import { FineTunedModels } from './utils/LLMEngine';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import TelegramBot = require('node-telegram-bot-api')
import {TelegramAPI} from "../../providers/Telegram";

@Injectable()
export class ChatService {
    constructor(
        @Inject(RedisClient)
        private readonly redisClient: RedisClient,
        @Inject(forwardRef(() => TelegramAPI))
        private readonly telegram: TelegramAPI,
    ){}
    
    llm:BaseChatModel;
    chatEngine:ChatEngine;
    
    async sendMessage(body:SendMessageBody):Promise<any> {
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

    async onBotMessageReceived(message:TelegramBot.Message):Promise<void> {
        if (!message.from?.id || !message.text) {
            return;
        }

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
