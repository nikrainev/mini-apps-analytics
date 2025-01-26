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
exports.PresentationController = void 0;
const common_1 = require("@nestjs/common");
const presentation_service_1 = require("./presentation.service");
const response_interceptor_1 = require("../../middlewares/response.interceptor");
let PresentationController = class PresentationController {
    constructor(presentationService) {
        this.presentationService = presentationService;
    }
};
exports.PresentationController = PresentationController;
exports.PresentationController = PresentationController = __decorate([
    (0, common_1.Controller)('presentation'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(response_interceptor_1.TransformInterceptor),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => presentation_service_1.PresentationService))),
    __metadata("design:paramtypes", [presentation_service_1.PresentationService])
], PresentationController);
//# sourceMappingURL=presentation.controller.js.map