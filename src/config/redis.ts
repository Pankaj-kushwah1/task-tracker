// src/config/redis.ts
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

redis.on("error", (err) => {
  console.error("ioredis error:", err);
});

export default redis;
