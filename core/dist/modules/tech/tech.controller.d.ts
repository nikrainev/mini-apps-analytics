import { TechService } from './tech.service';
import { ILoadInfoResponse } from './requests/loadInfo.request';
import { S3 } from 'providers/S3';
export declare class TechController {
    private readonly techService;
    private readonly s3;
    constructor(techService: TechService, s3: S3);
    loadInfo(query: string): Promise<ILoadInfoResponse>;
    loadBotInfo(): Promise<any>;
}
