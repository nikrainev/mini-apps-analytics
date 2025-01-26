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
exports.TechController = void 0;
const common_1 = require("@nestjs/common");
const tech_service_1 = require("./tech.service");
const response_interceptor_1 = require("../../middlewares/response.interceptor");
const S3_1 = require("../../providers/S3");
let TechController = class TechController {
    constructor(techService, s3) {
        this.techService = techService;
        this.s3 = s3;
    }
    async loadInfo(query) {
        return this.techService.loadInfo(query);
    }
    async loadBotInfo() {
        return this.techService.getBotInfo();
    }
};
exports.TechController = TechController;
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TechController.prototype, "loadInfo", null);
__decorate([
    (0, common_1.Get)('/bot-info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TechController.prototype, "loadBotInfo", null);
exports.TechController = TechController = __decorate([
    (0, common_1.Controller)('tech'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(response_interceptor_1.TransformInterceptor),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => tech_service_1.TechService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => S3_1.S3))),
    __metadata("design:paramtypes", [tech_service_1.TechService,
        S3_1.S3])
], TechController);
//# sourceMappingURL=tech.controller.js.map