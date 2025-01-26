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
exports.RedisClient = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const AppEnv_1 = require("../common/const/AppEnv");
const vars_1 = require("../config/vars");
let RedisClient = class RedisClient {
    constructor(client) {
        this.client = client;
    }
    onModuleDestroy() {
        this.client.disconnect();
    }
    async get({ prefix, key }) {
        if (!this.isRedisAvailable()) {
            return '';
        }
        return this.client.get(`${prefix}:${key}`);
    }
    async set({ prefix, key, value }) {
        if (!this.isRedisAvailable()) {
            return;
        }
        await this.client.set(`${prefix}:${key}`, value);
    }
    async hset({ prefix, key, value }) {
        if (!this.isRedisAvailable()) {
            return;
        }
        await this.client.hset(`${prefix}:${key}`, value);
    }
    async hdelete({ prefix, key, objKey }) {
        if (!this.isRedisAvailable()) {
            return;
        }
        await this.client.hdel(`${prefix}:${key}`, objKey);
    }
    async hgetall({ prefix, key }) {
        if (!this.isRedisAvailable()) {
            return {};
        }
        return this.client.hgetall(`${prefix}:${key}`);
    }
    async delete(prefix, key) {
        if (!this.isRedisAvailable()) {
            return;
        }
        await this.client.del(`${prefix}:${key}`);
    }
    isRedisAvailable() {
        return AppEnv_1.AppEnv.Production == vars_1.vars.appEnv;
    }
};
exports.RedisClient = RedisClient;
exports.RedisClient = RedisClient = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RedisClient')),
    __metadata("design:paramtypes", [ioredis_1.Redis])
], RedisClient);
//# sourceMappingURL=RedisClient.js.map