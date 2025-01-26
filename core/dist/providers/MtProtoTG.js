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
exports.MtProtoTG = void 0;
const common_1 = require("@nestjs/common");
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const readline_1 = require("readline");
const apiId = 123456;
const apiHash = "123456abcdfg";
const stringSession = new sessions_1.StringSession("");
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
let MtProtoTG = class MtProtoTG {
    constructor() {
        const client = new telegram_1.TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5,
        });
    }
};
exports.MtProtoTG = MtProtoTG;
exports.MtProtoTG = MtProtoTG = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MtProtoTG);
//# sourceMappingURL=MtProtoTG.js.map