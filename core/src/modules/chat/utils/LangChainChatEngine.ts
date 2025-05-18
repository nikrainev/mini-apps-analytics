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
    onSaveContext: () => Promise<void>,
    onAppendNewMessage: (ai:string) => Promise<void>
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
        const llmResult = await this.llm.invoke(prompt);

        return {
            response: llmResult.content as string,
            onSaveContext: async () => {
                await this.memory.saveContext({ content: humanMessage }, { content: llmResult.content });
                return;
            },
            onAppendNewMessage: async (ai) => {
                await this.memory.saveContext({ content: ' ' }, { content: ai });
                return;
            },
        };
    }
}