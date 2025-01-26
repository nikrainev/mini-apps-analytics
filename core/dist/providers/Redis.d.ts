import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
export declare const redisClientFactory: FactoryProvider<Redis>;
