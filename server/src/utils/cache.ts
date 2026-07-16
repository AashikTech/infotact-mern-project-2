import { getRedisClient } from '../config/redis';

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const redis = getRedisClient();
    if (!redis) return null;
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const cacheSet = async (key: string, data: any, ttlSeconds: number = 3600): Promise<void> => {
  try {
    const redis = getRedisClient();
    if (!redis) return;
    await redis.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

export const cacheDelete = async (key: string): Promise<void> => {
  try {
    const redis = getRedisClient();
    if (!redis) return;
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

export const cacheDeletePattern = async (pattern: string): Promise<void> => {
  try {
    const redis = getRedisClient();
    if (!redis) return;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Cache delete pattern error:', error);
  }
};
