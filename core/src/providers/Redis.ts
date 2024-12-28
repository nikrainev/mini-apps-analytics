import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

import { vars } from 'config/vars';
import { AppEnv } from '../common/const/AppEnv';

export const redisClientFactory: FactoryProvider<Redis> = {
    provide: 'RedisClient',
    useFactory: () => {
        const redisInstance = new Redis({
            host: vars.redis.host,
            port: vars.redis.port,
            username: vars.redis.username,
            password: vars.redis.password,
            tls: vars.appEnv !== AppEnv.Production ? undefined : {},
        });
        
        redisInstance.on('error', e => {
            throw new Error(`Redis connection failed: ${e}`);
        });

        return redisInstance;
    },
    inject: [],
};