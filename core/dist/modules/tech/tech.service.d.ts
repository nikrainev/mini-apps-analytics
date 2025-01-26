import { ILoadInfoResponse } from './requests/loadInfo.request';
import { S3 } from 'providers/S3';
import { Model } from 'mongoose';
import { SearchAppDocument } from '../../schemas/searchApp.scheme';
import { TelegramAPI } from '../../providers/Telegram';
export declare class TechService {
    private readonly s3;
    private searchApp;
    private readonly tg;
    constructor(s3: S3, searchApp: Model<SearchAppDocument>, tg: TelegramAPI);
    loadInfo(query: string): Promise<ILoadInfoResponse>;
    getBotInfo(): Promise<any>;
}
