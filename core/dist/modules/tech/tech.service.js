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
exports.TechService = void 0;
const common_1 = require("@nestjs/common");
const S3_1 = require("../../providers/S3");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const MTProto = require('@mtproto/core');
const searchApp_scheme_1 = require("../../schemas/searchApp.scheme");
const appCenter_1 = require("../discovery/utils/appCenter");
const Telegram_1 = require("../../providers/Telegram");
const path = require("path");
let TechService = class TechService {
    constructor(s3, searchApp, tg) {
        this.s3 = s3;
        this.searchApp = searchApp;
        this.tg = tg;
    }
    async loadInfo(query) {
        const response = await (0, appCenter_1.searchApi)({
            query,
        });
        const idsList = await this.searchApp.find().select({
            appId: 1,
        }).exec();
        const idsList_Arr = idsList.map((l) => l.appId);
        const data = await response.json();
        const insertArr = [];
        const onlyNew = data.data.filter((d) => !idsList_Arr.includes(d.id));
        onlyNew.forEach((d) => {
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
        await this.searchApp.bulkWrite(insertArr);
        return {
            version: 2,
            uptime: process.uptime(),
            newCount: onlyNew.length,
        };
    }
    async getBotInfo() {
        const api_id = 21155184;
        const api_hash = '26563d0ac8029e4f6787f50edad5f5b2';
        const mtproto = new MTProto({
            api_id,
            api_hash,
            storageOptions: {
                path: path.resolve(__dirname, './data/1.json'),
            },
        });
        mtproto.call('bots.getBotInfo', {}).then((result) => {
            console.log('country:', result.country);
        });
    }
};
exports.TechService = TechService;
exports.TechService = TechService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => S3_1.S3))),
    __param(1, (0, mongoose_2.InjectModel)(searchApp_scheme_1.SearchApp.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => Telegram_1.TelegramAPI))),
    __metadata("design:paramtypes", [S3_1.S3,
        mongoose_1.Model,
        Telegram_1.TelegramAPI])
], TechService);
//# sourceMappingURL=tech.service.js.map