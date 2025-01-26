"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryService = void 0;
const schedule_1 = require("@nestjs/schedule");
const sleep_1 = require("../../utils/helpers/sleep");
const getRandomArbitrary_1 = require("../../utils/number/getRandomArbitrary");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const appCenterQuery_scheme_1 = require("../../schemas/appCenterQuery.scheme");
const getQueryForAppCenter_1 = require("./utils/getQueryForAppCenter");
const appPath_scheme_1 = require("../../schemas/appPath.scheme");
const appCenter_1 = require("./utils/appCenter");
let DiscoveryService = class DiscoveryService {
    constructor(appCenterQuery, appPath) {
        this.appCenterQuery = appCenterQuery;
        this.appPath = appPath;
    }
    async handleCron() {
        const randomDelay = (0, getRandomArbitrary_1.getRandomArbitrary)({
            min: 0,
            max: 120000,
        });
        await (0, sleep_1.sleep)(randomDelay);
        const currentQuery = await this.appCenterQuery.findOne({}).exec();
        const nextQuery = (0, getQueryForAppCenter_1.getQueryForAppCenter)({
            prevQuery: currentQuery?.query || undefined,
        });
        if (currentQuery) {
            await this.appCenterQuery.updateOne({
                _id: currentQuery?._id,
            }, {
                query: nextQuery,
                createdAt: new Date(),
            });
        }
        else {
            const newQuery = new this.appCenterQuery({
                query: nextQuery,
            });
            await newQuery.save();
        }
        const idsList = await this.appPath.find().select({
            appId: 1,
        }).exec();
        const idsList_Arr = idsList.map((l) => l.appId);
        const response = await (0, appCenter_1.searchApi)({
            query: nextQuery,
        });
        const data = await response.json();
        const insertArr = [];
        const onlyNew = data.data.filter((d) => !idsList_Arr.includes(d.id));
        const now = new Date();
        onlyNew.forEach((d) => {
            insertArr.push({
                insertOne: {
                    document: {
                        appId: d.id,
                        url: d.attributes.url,
                        path: d.attributes.path,
                        title: d.attributes.title,
                        description: d.attributes.description,
                        createdAt: d.attributes.createdAt,
                        updatedAt: d.attributes.updatedAt,
                        publishedAt: d.attributes.publishedAt,
                        findAt: now,
                    },
                },
            });
        });
        await this.appPath.bulkWrite(insertArr);
    }
};
exports.DiscoveryService = DiscoveryService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryService.prototype, "handleCron", null);
exports.DiscoveryService = DiscoveryService = __decorate([
    __param(0, (0, mongoose_1.InjectModel)(appCenterQuery_scheme_1.AppCenterQuery.name)),
    __param(1, (0, mongoose_1.InjectModel)(appPath_scheme_1.AppPath.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DiscoveryService);
//# sourceMappingURL=discovery.service.js.map