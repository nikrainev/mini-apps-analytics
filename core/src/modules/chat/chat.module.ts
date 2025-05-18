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
import { ChatCronService } from './chat.cron';
import { DialogData, DialogDataSchema } from 'schemas/dialogData.scheme';
import { DialogStats, DialogStatsSchema } from 'schemas/dialogStats.scheme';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DialogData.name, schema: DialogDataSchema },
            { name: DialogStats.name, schema: DialogStatsSchema },
        ]),
    ],
    controllers: [ChatController],
    providers: [
        ChatService,
        redisClientFactory,
        RedisClient,
        TelegramAPI,
        QdrantProvider,
        YandexMLProvider,
        ChatCronService,
    ],
    exports: [],
})

export class ChatModule {}
