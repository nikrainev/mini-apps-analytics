import {
    Module,
} from '@nestjs/common';

import { DiscoveryService } from './discovery.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppCenterQuerySchema, AppCenterQuery } from 'schemas/appCenterQuery.scheme';
import { AppPath, AppPathSchema } from 'schemas/appPath.scheme';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AppCenterQuery.name, schema: AppCenterQuerySchema },
            { name: AppPath.name, schema: AppPathSchema },
        ]),
    ],
    controllers: [],
    providers: [
        DiscoveryService,
    ],
    exports: [],
})

export class DiscoveryModule {}
