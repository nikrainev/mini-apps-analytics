import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    forwardRef,
    Inject,
    Post,
    Req,
    UseInterceptors,
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { TransformInterceptor } from 'middlewares/response.interceptor';
import { IRequest } from 'common/types/fastify.types';
import { SendMessageBody } from './requests/sendMessage.request';
import { vars } from 'config/vars';
import { MyLogger } from 'config/MyLogger';
import { TelegramAPI } from 'providers/Telegram';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import TelegramBot = require('node-telegram-bot-api')

@Controller('chat')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class ChatController {
    constructor(
        @Inject(forwardRef(() => ChatService))
        private readonly chatService: ChatService,
        @Inject(forwardRef(() => MyLogger))
        private readonly logger: MyLogger,
        @Inject(forwardRef(() => TelegramAPI))
        private readonly telegram: TelegramAPI,
    ) {}


    @Post('message')
    async sendMessage(
        @Req() req:IRequest,
        @Body() body:SendMessageBody,
    ):Promise<any> {
        return this.chatService.sendMessage(body);
    }

    @Post(`tg-bot2/${vars.telegram.meBotToken}`)
    async tgBotEndpoint(
        @Req() req:IRequest,
        @Body() body:TelegramBot.Update,
    ):Promise<any> {
        this.telegram.client.processUpdate(body);
        this.logger.log('Received any message from bot:');

        if (body.message && body.message?.text && (body.message?.text !== '/start')) {
            await this.chatService.onBotMessageReceived(body.message);
        }

        return true;
    }
}
