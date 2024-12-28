import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AppEnv } from '../common/const/AppEnv';
import { vars } from '../config/vars';

@Injectable()
export class RedisClient implements OnModuleDestroy {
    constructor(@Inject('RedisClient') private readonly client: Redis) {}

    onModuleDestroy(): void {
        this.client.disconnect();
    }

    async get({ prefix, key }:{ prefix: string, key: string }): Promise<string | null> {
        if (!this.isRedisAvailable()) {
            return '';
        }
        return this.client.get(`${prefix}:${key}`);
    }

    async set({ prefix, key, value }:{ prefix: string, key: string, value: string }): Promise<void> {
        if (!this.isRedisAvailable()) {
            return;
        }
        await this.client.set(`${prefix}:${key}`, value);
    }

    async hset({ prefix, key, value }:{
        prefix: string, key: string, value: Record<string, string | number | null>
    }): Promise<void> {
        if (!this.isRedisAvailable()) {
            return;
        }
        await this.client.hset(`${prefix}:${key}`, value);
    }

    async hdelete({ prefix, key, objKey }:{
        prefix: string, key: string, objKey: string
    }): Promise<void> {
        if (!this.isRedisAvailable()) {
            return;
        }
        await this.client.hdel(`${prefix}:${key}`, objKey);
    }

    async hgetall({ prefix, key }:{ prefix: string, key: string }): Promise<Record<string, string | null>> {
        if (!this.isRedisAvailable()) {
            return {};
        }
        return this.client.hgetall(`${prefix}:${key}`);
    }

    async delete(prefix: string, key: string): Promise<void> {
        if (!this.isRedisAvailable()) {
            return;
        }
        await this.client.del(`${prefix}:${key}`);
    }

    private isRedisAvailable() {
        return AppEnv.Production == vars.appEnv;
    }
}
