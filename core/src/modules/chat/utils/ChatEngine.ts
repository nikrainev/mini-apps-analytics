import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
    CompiledStateGraph,
} from '@langchain/langgraph';
import { v4 as uuidv4 } from 'uuid';

import { CustomLLM } from 'providers/CustomLLM';

export class ChatEngine {
    private llm:CustomLLM;
    private app:CompiledStateGraph<any, any, any, any, any, any>;
    private config = { configurable: { thread_id: uuidv4() } };

    constructor(llm:CustomLLM) {
        this.llm = llm;

        const callModel  = async (state: typeof MessagesAnnotation.State) =>{
            const response = await this.llm.invoke(state.messages);
            return { messages: response };
        };

        const workflow = new StateGraph(MessagesAnnotation)
            .addNode('model', callModel)
            .addEdge(START, 'model')
            .addEdge('model', END);

        const memory = new MemorySaver();
        this.app = workflow.compile({ checkpointer: memory });
    }

    async invoke(input:{
        role: string,
        content: string
    }[]):Promise<string> {
        const output = await this.app.invoke({ messages: input }, this.config);

        return output.messages[output.messages.length - 1];
    }
}