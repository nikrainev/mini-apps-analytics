import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisClient implements OnModuleDestroy {
    constructor(@Inject('RedisClient') public readonly client: Redis) {}

    onModuleDestroy(): void {
        this.client.disconnect();
    }
}
