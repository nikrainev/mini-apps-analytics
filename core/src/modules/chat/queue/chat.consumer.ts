import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { forwardRef, Inject } from '@nestjs/common';
import { TelegramAPI } from 'providers/Telegram';

@Processor('sendMessage')
export class SendMessageConsumer extends WorkerHost {
    constructor(
        @Inject(forwardRef(() => TelegramAPI))
        private readonly telegram: TelegramAPI,
    ){
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        console.log(job.data);
        await this.telegram.client.sendMessage(job.data.chatId, job.data.text);
        return {};
    }
}