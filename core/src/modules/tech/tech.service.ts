import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ILoadInfoResponse } from './requests/loadInfo.request';
import { S3 } from 'providers/S3';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const MTProto = require('@mtproto/core');

import { SearchApp, SearchAppDocument } from '../../schemas/searchApp.scheme';
import { searchApi } from '../discovery/utils/appCenter';
import { TelegramAPI } from '../../providers/Telegram';
import * as path from 'path';

@Injectable()
export class TechService {
    constructor(
        @Inject(forwardRef(() => S3))
        private readonly s3: S3,
        @InjectModel(SearchApp.name)
        private searchApp: Model<SearchAppDocument>,
        @Inject(forwardRef(() => TelegramAPI))
        private readonly tg: TelegramAPI,
    ) {}
    
    async loadInfo(query: string):Promise<ILoadInfoResponse> {
        const response = await searchApi({
            query,
        });

        const idsList = await this.searchApp.find().select({
            appId: 1,
        }).exec();

        const idsList_Arr = idsList.map((l) => l.appId);

        const data = await response.json();

        const insertArr:Record<string, any>[] = [];

        const onlyNew = data.data.filter((d:any) => !idsList_Arr.includes(d.id));

        onlyNew.forEach((d:Record<string, any>) => {
            insertArr.push({
                insertOne: {
                    document: {
                        appId: d.id,
                        requestPayload: d.attributes,
                        createdAt: new Date(),
                    },
                },
            });
        });

        await this.searchApp.bulkWrite(insertArr as any);

        return {
            version: 2,
            uptime: process.uptime(),
            newCount: onlyNew.length,
        };
    }

    async getBotInfo():Promise<any> {
        const api_id = 21155184;
        const api_hash = '26563d0ac8029e4f6787f50edad5f5b2';

        const mtproto = new MTProto({
            api_id,
            api_hash,

            storageOptions: {
                path: path.resolve(__dirname, './data/1.json'),
            },
        });

        mtproto.call('bots.getBotInfo', {

        }).then((result:any) => {
            console.log('country:', result.country);
        });
    }
}
