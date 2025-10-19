import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
});

// Connect to Redis
redisClient.connect().catch(console.error);

export class RedisService {
  async check(username: string): Promise<boolean> {
    try {
      const exists = await redisClient.exists(username);
      return exists === 1;
    } catch (error) {
      console.error("Redis check error:", error);
      return false;
    }
  }

  async register(username: string): Promise<void> {
    try {
      await redisClient.set(username, "taken");
    } catch (error) {
      console.error("Redis register error:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await redisClient.quit();
  }
}
