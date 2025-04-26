import {
    Module,
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { redisClientFactory } from 'providers/Redis';
import { RedisClient } from 'providers/RedisClient';
import { TelegramAPI } from 'providers/Telegram';
import { QdrantProvider } from 'providers/QdrantClient';
import { YandexMLProvider } from 'providers/YandexML';

@Module({
    imports: [],
    controllers: [ChatController],
    providers: [
        ChatService,
        redisClientFactory,
        RedisClient,
        TelegramAPI,
        QdrantProvider,
        YandexMLProvider,
    ],
    exports: [],
})

export class ChatModule {}
