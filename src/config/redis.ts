// src/config/redis.ts
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redis.on("error", (err: Error) => console.error("Redis error:", err));

await redis.connect();

export default redis;
