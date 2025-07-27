// src/utils/cache.ts
import redis from "../config/redis.js";

const DEFAULT_EXPIRY = 60 * 5; // 5 minutes

export const setCache = async (key: string, value: unknown, expiry = DEFAULT_EXPIRY) => {
  const json = JSON.stringify(value);
  await redis.set(key, json, {
    EX: expiry, // Expiry in seconds
  });
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (key: string) => {
  await redis.del(key);
};
