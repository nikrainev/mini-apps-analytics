import { Cron, CronExpression } from '@nestjs/schedule';
import { sleep } from '../../utils/helpers/sleep';
import { getRandomArbitrary } from '../../utils/number/getRandomArbitrary';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppCenterQuery, AppCenterQueryDocument } from 'schemas/appCenterQuery.scheme';
import { getQueryForAppCenter } from './utils/getQueryForAppCenter';
import { AppPath, AppPathDocument } from 'schemas/appPath.scheme';
import { searchApi } from './utils/appCenter';

export class DiscoveryService {
    constructor(
        @InjectModel(AppCenterQuery.name)
        private appCenterQuery: Model<AppCenterQueryDocument>,
        @InjectModel(AppPath.name)
        private appPath: Model<AppPathDocument>,
    ) {}

    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleCron() {
        const randomDelay = getRandomArbitrary({
            min: 0,
            max: 120000,
        });
        await sleep(randomDelay);

        const currentQuery = await this.appCenterQuery.findOne({}).exec();
        const nextQuery = getQueryForAppCenter({
            prevQuery: currentQuery?.query || undefined,
        });

        if (currentQuery) {
            await this.appCenterQuery.updateOne({
                _id: currentQuery?._id,
            }, {
                query: nextQuery,
                createdAt: new Date(),
            });
        } else {
            const newQuery= new this.appCenterQuery({
                query: nextQuery,
            });

            await newQuery.save();
        }

        const idsList = await this.appPath.find().select({
            appId: 1,
        }).exec();

        const idsList_Arr = idsList.map((l) => l.appId);

        const response = await searchApi({
            query: nextQuery,
        });

        const data = await response.json();

        const insertArr:Record<string, any>[] = [];

        const onlyNew = data.data.filter((d:any) => !idsList_Arr.includes(d.id));

        const now = new Date();

        onlyNew.forEach((d:Record<string, any>) => {
            insertArr.push({
                insertOne: {
                    document: {
                        appId: d.id,
                        url:  d.attributes.url,
                        path:  d.attributes.path,
                        title:  d.attributes.title,
                        description:  d.attributes.description,
                        createdAt:  d.attributes.createdAt,
                        updatedAt:  d.attributes.updatedAt,
                        publishedAt:  d.attributes.publishedAt,
                        findAt: now,
                    },
                },
            });
        });

        await this.appPath.bulkWrite(insertArr as any);
    }
}
