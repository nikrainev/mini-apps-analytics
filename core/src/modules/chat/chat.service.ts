import { ChatEngine } from './utils/ChatEngine';
import { SendMessageBody } from './requests/sendMessage.request';
import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'providers/RedisClient';
import { ChatOpenAI } from '@langchain/openai';
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models';
import { vars } from '../../config/vars';
import { LangChainChatEngine } from './utils/LangChainChatEngine';
import { FineTunedModels } from './utils/LLMEngine';

@Injectable()
export class ChatService {
    constructor(
        @Inject(RedisClient)
        private readonly redisClient: RedisClient
    ){

    }
    
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
}
