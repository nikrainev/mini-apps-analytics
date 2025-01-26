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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPathSchema = exports.AppPath = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let AppPath = class AppPath {
};
exports.AppPath = AppPath;
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
    }),
    __metadata("design:type", Number)
], AppPath.prototype, "appId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], AppPath.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], AppPath.prototype, "path", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: new Date(),
    }),
    __metadata("design:type", Date)
], AppPath.prototype, "createdAt", void 0);
exports.AppPath = AppPath = __decorate([
    (0, mongoose_1.Schema)({
        toObject: {
            getters: true,
        },
    }),
    (0, mongoose_1.Schema)()
], AppPath);
exports.AppPathSchema = mongoose_1.SchemaFactory.createForClass(AppPath);
//# sourceMappingURL=appPath.scheme.js.map