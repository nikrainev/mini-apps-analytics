import { OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
export declare class RedisClient implements OnModuleDestroy {
    private readonly client;
    constructor(client: Redis);
    onModuleDestroy(): void;
    get({ prefix, key }: {
        prefix: string;
        key: string;
    }): Promise<string | null>;
    set({ prefix, key, value }: {
        prefix: string;
        key: string;
        value: string;
    }): Promise<void>;
    hset({ prefix, key, value }: {
        prefix: string;
        key: string;
        value: Record<string, string | number | null>;
    }): Promise<void>;
    hdelete({ prefix, key, objKey }: {
        prefix: string;
        key: string;
        objKey: string;
    }): Promise<void>;
    hgetall({ prefix, key }: {
        prefix: string;
        key: string;
    }): Promise<Record<string, string | null>>;
    delete(prefix: string, key: string): Promise<void>;
    private isRedisAvailable;
}
