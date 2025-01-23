import {
    ClassSerializerInterceptor,
    Controller,
    forwardRef,
    Inject,
    Get,
    UseInterceptors,
    Query,
} from '@nestjs/common';

import { TechService } from './tech.service';
import { TransformInterceptor } from 'middlewares/response.interceptor';
import { ILoadInfoResponse } from './requests/loadInfo.request';
import { S3 } from 'providers/S3';
@Controller('tech')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(TransformInterceptor)
export class TechController {
    constructor(
        @Inject(forwardRef(() => TechService))
        private readonly techService: TechService,
        @Inject(forwardRef(() => S3))
        private readonly s3: S3,
    ) {}

    @Get('/')
    async loadInfo(
        @Query('query') query:string,
    ):Promise<ILoadInfoResponse> {
        return this.techService.loadInfo(query);
    }

    @Get('/bot-info')
    async loadBotInfo():Promise<any> {
        return this.techService.getBotInfo();
    }
}
