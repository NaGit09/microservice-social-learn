import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}
  onModuleInit() {}

  async getData<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch (error) {
      return data as unknown as T;
    }
  }

  async setData(key: string, value: any, ttl?: number) {
    const dataString =
      typeof value === 'object' ? JSON.stringify(value) : value;

    if (ttl) {
      await this.redisClient.set(key, dataString, 'EX', ttl);
    } else {
      await this.redisClient.set(key, dataString);
    }
  }

  async delData(key: string) {
    await this.redisClient.del(key);
  }
}
