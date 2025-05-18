import { BaseMessage } from '@langchain/core/messages';
import OpenAI from 'openai';
import { vars } from 'config/vars';

export enum FineTunedModels {
    BashirLlama70b = 'meta-llama/Llama-3.3-70B-Instruct-LoRa:bashir-lora-EpfX',
    Llama70bAllMy = 'meta-llama/Llama-3.3-70B-Instruct-LoRa:all-dialogs-MRct'
}

interface InvokeArgs {
    messages: BaseMessage[],
}

export abstract class LLMEngine {
    model: FineTunedModels;
    temperature: number;
    
    constructor(args:{
        model: FineTunedModels,
        temperature: number,
    }) {
        this.temperature = args.temperature;
        this.model = args.model;
    }
    
    abstract invoke(args:InvokeArgs): Promise<{ messages: string }>
}

export class LLMEngineBase implements LLMEngine {
    model: FineTunedModels;
    temperature: number;
    openAILLm:OpenAI;

    constructor(args:{
        model: FineTunedModels,
        temperature: number,
    }) {
        this.openAILLm = new OpenAI({
            baseURL: vars.nebius.baseUrl,
            apiKey: vars.nebius.secretKey,
        });
        this.temperature = args.temperature;
        this.model = args.model;
    }

    async invoke(args: InvokeArgs): Promise<{ messages: string }> {
        return { messages: '' };
    }
}

const transformToOpenAiMessages = (messages: BaseMessage[]) => {
    return messages.map((m) => {
        const role:'system' | 'user' | 'assistant' | 'function' = 'system';

        return {
            role,
            content: m.content.toString() || '',
        };
    });
};

class BashirLlama70b extends LLMEngineBase  {
    async invoke(args:InvokeArgs): Promise<{ messages: string}> {
        const result = await this.openAILLm.chat.completions.create({
            model: 'meta-llama/Llama-3.3-70B-Instruct-LoRa:bashir-lora-EpfX',
            temperature: 0,
            messages: transformToOpenAiMessages(args.messages),
        });

        return { messages: result.choices[0]?.message?.content || '' };
    }

    model: FineTunedModels;
    temperature: number;
}

export const llmBuilder = (args: {
    model: FineTunedModels,
    temperature: number,
}) => {
    switch (args.model) {
        case FineTunedModels.BashirLlama70b:
            return new BashirLlama70b({
                model: args.model,
                temperature: args.temperature,
            });
        default:
            throw new Error(`Unknown model: ${args.model}`);
    }
};