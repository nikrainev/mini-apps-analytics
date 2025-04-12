import { LLM, type BaseLLMParams } from '@langchain/core/language_models/llms';
import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import { GenerationChunk } from '@langchain/core/outputs';
import { spawn } from 'node:child_process';


const getLLMResult = async (prompt:string):Promise<string> => {
    return new Promise((res, rej) => {
        const ls = spawn('mlx_lm.generate', [
            '--model', '/Users/nikitakrainev/Desktop/HSEDiplom/Dialogs/model/bashir_1000_Ministral-8B',
            '--max-tokens', '500',
            '--prompt', prompt,
        ]);

        let result = '';
        ls.stdout.on('data', (data) => {
            result = result + data;
        });

        ls.stderr.on('data', (data) => {
            rej(data);
        });

        ls.on('close', (code) => {
            res(result.split('==========')?.[1].replaceAll('\n', ''));
        });
    });
};

interface CustomLLMInput extends BaseLLMParams {
    n: number;
}

export class CustomLLM extends LLM {
    n: number;

    constructor(fields: CustomLLMInput) {
        super(fields);
        this.n = fields.n;
    }

    _llmType() {
        return 'custom';
    }

    async _call(
        prompt: string,
        options: this['ParsedCallOptions'],
        runManager: CallbackManagerForLLMRun
    ): Promise<string> {
        return getLLMResult(prompt.slice(0, this.n));
    }

    async *_streamResponseChunks(
        prompt: string,
        options: this['ParsedCallOptions'],
        runManager?: CallbackManagerForLLMRun
    ): AsyncGenerator<GenerationChunk> {
        // Pass `runManager?.getChild()` when invoking internal runnables to enable tracing
        // await subRunnable.invoke(params, runManager?.getChild());
        for (const letter of prompt.slice(0, this.n)) {
            yield new GenerationChunk({
                text: letter,
            });
            // Trigger the appropriate callback
            await runManager?.handleLLMNewToken(letter);
        }
    }
}