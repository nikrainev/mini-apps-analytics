import {
    ClassSerializerInterceptor,
    Controller,
    forwardRef,
    Inject,
    UseInterceptors,
} from '@nestjs/common';

import { PresentationService } from './presentation.service';
import { TransformInterceptor } from 'middlewares/response.interceptor';

@Controller('presentation')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class PresentationController {
    constructor(
        @Inject(forwardRef(() => PresentationService))
        private readonly presentationService: PresentationService,
    ) {}
}
