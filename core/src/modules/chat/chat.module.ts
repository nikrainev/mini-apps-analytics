import {
    Module,
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { redisClientFactory } from 'providers/Redis';
import { RedisClient } from 'providers/RedisClient';

@Module({
    imports: [],
    controllers: [ChatController],
    providers: [
        ChatService,
        redisClientFactory,
        RedisClient,
    ],
    exports: [],
})

export class ChatModule {}
