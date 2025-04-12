import { CustomLLM } from '../../providers/CustomLLM';
import { ChatEngine } from './utils/ChatEngine';
import { SendMessageBody } from './requests/sendMessage.request';

export class ChatService {
    llm:CustomLLM;
    chatEngine:ChatEngine;
    
    constructor() {
        this.llm = new CustomLLM({ n: 100000 });
        this.chatEngine = new ChatEngine(this.llm);
    }
    
    async sendMessage(body:SendMessageBody):Promise<any> {
        const result = await this.chatEngine.invoke([{
            role: 'user',
            content: body.text,
        }]);

        return {
            response: result,
        };
    }
}
