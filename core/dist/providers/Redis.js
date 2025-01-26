"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClientFactory = void 0;
const ioredis_1 = require("ioredis");
const vars_1 = require("../config/vars");
const AppEnv_1 = require("../common/const/AppEnv");
exports.redisClientFactory = {
    provide: 'RedisClient',
    useFactory: () => {
        const redisInstance = new ioredis_1.Redis({
            host: vars_1.vars.redis.host,
            port: vars_1.vars.redis.port,
            username: vars_1.vars.redis.username,
            password: vars_1.vars.redis.password,
            tls: vars_1.vars.appEnv !== AppEnv_1.AppEnv.Production ? undefined : {},
        });
        redisInstance.on('error', e => {
            throw new Error(`Redis connection failed: ${e}`);
        });
        return redisInstance;
    },
    inject: [],
};
//# sourceMappingURL=Redis.js.map