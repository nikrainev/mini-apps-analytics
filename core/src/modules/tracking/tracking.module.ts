import {
    Module,
} from '@nestjs/common';

import { TrackingService } from './tracking.service';

@Module({
    imports: [],
    controllers: [],
    providers: [
        TrackingService,
    ],
    exports: [],
})

export class TrackingModule {}
