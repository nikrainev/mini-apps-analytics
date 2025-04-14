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
import { vars } from '../../config/vars';
import { MyLogger } from '../../config/MyLogger';

@Controller('chat')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class ChatController {
    constructor(
        @Inject(forwardRef(() => ChatService))
        private readonly chatService: ChatService,
        @Inject(forwardRef(() => MyLogger))
        private readonly logger: MyLogger,
    ) {}


    @Post('message')
    async sendMessage(
        @Req() req:IRequest,
        @Body() body:SendMessageBody,
    ):Promise<any> {
        return this.chatService.sendMessage(body);
    }

    @Post(`tg-bot/${vars.telegram.meBotToken}`)
    async tgBotEndpoint(
        @Req() req:IRequest,
        @Body() body:Record<string, any>,
    ):Promise<any> {
        this.logger.log('Telegram bot webhook received', body);
    }
}
