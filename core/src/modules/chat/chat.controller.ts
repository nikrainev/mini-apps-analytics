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

@Controller('chat')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class ChatController {
    constructor(
        @Inject(forwardRef(() => ChatService))
        private readonly chatService: ChatService,
    ) {}


    @Post('message')
    async sendMessage(
        @Req() req:IRequest,
        @Body() body:SendMessageBody,
    ):Promise<any> {
        return this.chatService.sendMessage(body);
    }
}
