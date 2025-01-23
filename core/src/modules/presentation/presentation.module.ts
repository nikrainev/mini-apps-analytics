import {
    Module,
} from '@nestjs/common';

import { PresentationService } from './presentation.service';
import { PresentationController } from './presentation.controller';

@Module({
    imports: [],
    controllers: [PresentationController],
    providers: [
        PresentationService,
    ],
    exports: [],
})

export class PresentationModule {}
