import {
    CompiledStateGraph, END, MessagesAnnotation, START, StateGraph,
} from '@langchain/langgraph';
import { v4 as uuidv4 } from 'uuid';

import { LLMEngine } from './LLMEngine';

export class ChatEngine {
    private llm:LLMEngine;
    private app:CompiledStateGraph<any, any, any, any, any, any>;
    private config = { configurable: { thread_id: uuidv4() } };

    constructor({
        llm,
    }:{
        llm: LLMEngine
    }) {
        this.llm = llm;

        const callModel  = async (state: typeof MessagesAnnotation.State):Promise<{ messages:string }> =>{
            return await this.llm.invoke({
                messages: state.messages,
            });
        };

        const workflow = new StateGraph(MessagesAnnotation)
            .addNode('model', callModel)
            .addEdge(START, 'model')
            .addEdge('model', END);

        this.app = workflow.compile({
            checkpointer: false,
            interruptAfter: '*',
        });
    }

    async call(input:{
        role: string,
        content: string
    }[]):Promise<string> {
        console.log('invoke', input);
        const output = await this.app.invoke({ messages: input }, this.config);

        return output.messages[output.messages.length - 1];
    }
}