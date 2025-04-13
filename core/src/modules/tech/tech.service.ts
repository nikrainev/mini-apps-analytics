import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ILoadInfoResponse } from './requests/loadInfo.request';
import { S3 } from 'providers/S3';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const MTProto = require('@mtproto/core');

import { TelegramAPI } from '../../providers/Telegram';
import * as path from 'path';

@Injectable()
export class TechService {
    constructor(
        @Inject(forwardRef(() => S3))
        private readonly s3: S3,
        @Inject(forwardRef(() => TelegramAPI))
        private readonly tg: TelegramAPI,
    ) {}
    
    async loadInfo():Promise<ILoadInfoResponse> {
        return {
            version: 2,
            uptime: process.uptime(),
        };
    }
}
