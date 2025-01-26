"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryModule = void 0;
const common_1 = require("@nestjs/common");
const discovery_service_1 = require("./discovery.service");
const mongoose_1 = require("@nestjs/mongoose");
const appCenterQuery_scheme_1 = require("../../schemas/appCenterQuery.scheme");
const appPath_scheme_1 = require("../../schemas/appPath.scheme");
let DiscoveryModule = class DiscoveryModule {
};
exports.DiscoveryModule = DiscoveryModule;
exports.DiscoveryModule = DiscoveryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: appCenterQuery_scheme_1.AppCenterQuery.name, schema: appCenterQuery_scheme_1.AppCenterQuerySchema },
                { name: appPath_scheme_1.AppPath.name, schema: appPath_scheme_1.AppPathSchema },
            ]),
        ],
        controllers: [],
        providers: [
            discovery_service_1.DiscoveryService,
        ],
        exports: [],
    })
], DiscoveryModule);
//# sourceMappingURL=discovery.module.js.map