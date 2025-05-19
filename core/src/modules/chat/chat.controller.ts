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
import { InjectModel } from '@nestjs/mongoose';
import { MessageQueue, MessageQueueDocument } from '../../schemas/messageQueue.scheme';
import { Model } from 'mongoose';

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
        @InjectModel(MessageQueue.name)
        private messageQueueModel: Model<MessageQueueDocument>,
    ) {}


    @Post('message')
    async sendMessage(
        @Req() req:IRequest,
        @Body() body:SendMessageBody,
    ):Promise<any> {

        const newMessage = new this.messageQueueModel({
            chatId: 'body.message.chat.id.toString()',
            text: 'body.message.text',
            createdAt: new Date(),
        });

        await newMessage.save();
        
        return 'this.chatService.sendMessage(body);';
    }

    @Post(`tg-bot2/${vars.telegram.meBotToken}`)
    async tgBotEndpoint(
        @Req() req:IRequest,
        @Body() body:TelegramBot.Update,
    ):Promise<any> {
        this.telegram.client.processUpdate(body);
        this.logger.log('Received any message from bot:');

        if (body.message && body.message?.text && (body.message?.text !== '/start')) {
            if (!body.message.from?.id || !body.message.text) {
                return true;
            }

            const newMessage = new this.messageQueueModel({
                chatId: body.message.chat.id.toString(),
                text: body.message.text,
                createdAt: new Date(),
            });

            await newMessage.save();
        }

        return true;
    }
}
