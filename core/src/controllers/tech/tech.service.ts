import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ILoadInfoResponse } from './requests/loadInfo.request';
import { S3 } from 'providers/S3';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import { SearchApp, SearchAppDocument } from "../../schemas/searchApp.scheme";
import {searchApi} from "../../utils/appCenter";

@Injectable()
export class TechService {
    constructor(
        @Inject(forwardRef(() => S3))
        private readonly s3: S3,
        @InjectModel(SearchApp.name)
        private searchApp: Model<SearchAppDocument>,
    ) {}
    
    async loadInfo(query: string):Promise<ILoadInfoResponse> {
        const response = await searchApi({
            query,
        })

        let idsList = await this.searchApp.find().select({
            appId: 1
        }).exec();

        let idsList_Arr = idsList.map((l) => l.appId);

        const data = await response.json();

        const insertArr:Record<string, any>[] = [];

        const onlyNew = data.data.filter((d:any) => !idsList_Arr.includes(d.id))

        onlyNew.forEach((d:Record<string, any>) => {
            insertArr.push({
                insertOne: {
                    document: {
                        appId: d.id,
                        requestPayload: d.attributes,
                        createdAt: new Date()
                    }
                }
            })
        });

        await this.searchApp.bulkWrite(insertArr as any);

        return {
            version: 2,
            uptime: process.uptime(),
            newCount: onlyNew.length
        };
    }
}
