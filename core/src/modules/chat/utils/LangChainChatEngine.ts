import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models';
import { BufferMemory } from 'langchain/memory';
import { RedisChatMessageHistory } from '@langchain/redis';
import { ConversationChain } from 'langchain/chains';
import { vars } from '../../../config/vars';
import { ChainValues } from '@langchain/core/dist/utils/types';

const {
    username,
    password,
    host,
    port,
} = vars.redis;

export class LangChainChatEngine {
    private llm:BaseChatModel;
    private conversationChain:ConversationChain;

    constructor({
        llm,
        sessionId,
    }:{
        llm: BaseChatModel,
        sessionId: string,
    }) {
        this.llm = llm;

        const memory = new BufferMemory({
            chatHistory: new RedisChatMessageHistory({
                config:{
                    url: `redis://${username}:${password}@${host}:${port}`,
                    username: username,
                    password: password,
                },
                sessionId,
            }),
        });

        this.conversationChain = new ConversationChain({ llm: this.llm, memory });
    }

    async invoke(input: { content: string } ):Promise<ChainValues> {
        const output = await this.conversationChain.invoke({
            input: input.content,
        });

        return output;
    }
}