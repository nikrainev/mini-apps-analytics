"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const jwt_auth_guard_1 = require("./middlewares/guards/jwt-auth.guard");
const jwt_strategy_1 = require("./middlewares/guards/jwt.strategy");
const tech_module_1 = require("./modules/tech/tech.module");
const auth_module_1 = require("./modules/auth/auth.module");
const discovery_module_1 = require("./modules/discovery/discovery.module");
const presentation_module_1 = require("./modules/presentation/presentation.module");
const processing_module_1 = require("./modules/processing/processing.module");
const tracking_module_1 = require("./modules/tracking/tracking.module");
const vars_1 = require("./config/vars");
const MyLogger_1 = require("./config/MyLogger");
const { mongo: { connectionString, }, } = vars_1.vars;
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: vars_1.vars.jwtSalt,
            }),
            tech_module_1.TechModule,
            auth_module_1.AuthModule,
            discovery_module_1.DiscoveryModule,
            presentation_module_1.PresentationModule,
            processing_module_1.ProcessingModule,
            tracking_module_1.TrackingModule,
            mongoose_1.MongooseModule.forRoot(connectionString),
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forFeature([]),
        ],
        controllers: [],
        providers: [
            jwt_1.JwtModule,
            jwt_auth_guard_1.JwtAuthGuard,
            jwt_strategy_1.JwtStrategy,
            MyLogger_1.MyLogger,
        ],
        exports: [
            jwt_1.JwtModule,
            jwt_auth_guard_1.JwtAuthGuard,
            jwt_strategy_1.JwtStrategy,
            MyLogger_1.MyLogger,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map