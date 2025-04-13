import {
    Module,
} from '@nestjs/common';

import { TechService } from './tech.service';
import { TechController } from './tech.controller';
import { S3 } from 'providers/S3';
import { TelegramAPI } from '../../providers/Telegram';

@Module({
    imports: [],
    controllers: [TechController],
    providers: [
        TechService,
        S3,
        TelegramAPI,
    ],
    exports: [],
})

export class TechModule {}
