import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models';
import { BufferMemory } from 'langchain/memory';
import { RedisChatMessageHistory } from '@langchain/redis';
import { ConversationChain } from 'langchain/chains';
import { vars } from '../../../config/vars';

const {
    username,
    password,
    host,
    port,
} = vars.redis;

export interface IResponseWithActions {
    response: string,
    onSaveContext: () => Promise<void>
}


export class LangChainChatEngine {
    private llm:BaseChatModel;
    private conversationChain:ConversationChain;
    private memory:BufferMemory;

    constructor({
        llm,
        sessionId,
    }:{
        llm: BaseChatModel,
        sessionId: string,
    }) {
        this.llm = llm;

        this.memory = new BufferMemory({
            chatHistory: new RedisChatMessageHistory({
                config:{
                    url: `redis://${username}:${password}@${host}:${port}`,
                    username: username,
                    password: password,
                },
                sessionId,
            }),
            inputKey: 'content',
            outputKey: 'content',
        });
    }

    async invoke({ prompt, humanMessage }:{ prompt: string, humanMessage: string }):Promise<IResponseWithActions> {
        console.log('start invokr')
        const llmResult = await this.llm.invoke(prompt);

        return {
            response: llmResult.content as string,
            onSaveContext: async () => {
                console.log('on save content');
                await this.memory.saveContext({ content: humanMessage }, { content: llmResult.content });
                return;
            },
        };
    }
}