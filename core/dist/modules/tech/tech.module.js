"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechModule = void 0;
const common_1 = require("@nestjs/common");
const tech_service_1 = require("./tech.service");
const tech_controller_1 = require("./tech.controller");
const S3_1 = require("../../providers/S3");
const mongoose_1 = require("@nestjs/mongoose");
const searchApp_scheme_1 = require("../../schemas/searchApp.scheme");
const Telegram_1 = require("../../providers/Telegram");
let TechModule = class TechModule {
};
exports.TechModule = TechModule;
exports.TechModule = TechModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: searchApp_scheme_1.SearchApp.name, schema: searchApp_scheme_1.SearchAppSchema },
            ]),
        ],
        controllers: [tech_controller_1.TechController],
        providers: [
            tech_service_1.TechService,
            S3_1.S3,
            Telegram_1.TelegramAPI,
        ],
        exports: [],
    })
], TechModule);
//# sourceMappingURL=tech.module.js.map