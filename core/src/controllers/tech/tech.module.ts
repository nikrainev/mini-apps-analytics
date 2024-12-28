import {
    Module,
} from '@nestjs/common';

import { TechService } from './tech.service';
import { TechController } from './tech.controller';
import { S3 } from 'providers/S3';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchApp, SearchAppSchema } from "schemas/searchApp.scheme";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SearchApp.name, schema: SearchAppSchema },
        ]),
    ],
    controllers: [TechController],
    providers: [
        TechService,
        S3,
    ],
    exports: [],
})

export class TechModule {}
