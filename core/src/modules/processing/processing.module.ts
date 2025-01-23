import {
    Module,
} from '@nestjs/common';

import { ProcessingService } from './processing.service';

@Module({
    imports: [],
    controllers: [],
    providers: [
        ProcessingService,
    ],
    exports: [],
})

export class ProcessingModule {}
