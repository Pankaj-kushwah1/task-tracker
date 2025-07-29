import redis from "../../config/redis.js";

export const getTaskCache = async (
  userId: string,
  page: number,
  limit: number
) => {
  const key = `tasks:${userId}:page:${page}:limit:${limit}`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
};

export const setTaskCache = async (
  userId: string,
  page: number,
  limit: number,
  tasks: any
) => {
  const key = `tasks:${userId}:page:${page}:limit:${limit}`;
  await redis.set(key, JSON.stringify(tasks), "EX", 60 * 5);
};

export const invalidateTaskCache = async (userId: string) => {
  const keys = await redis.keys(`tasks:${userId}:*`);
  if (keys.length) await redis.del(...keys);
};
