import { Redis } from "ioredis";
import { EXTERNAL_REDIS_URL } from "../constants";

export const redisClient = () => {
  if (EXTERNAL_REDIS_URL) {
    console.log("Redis Server Connected Successfully!");
    return EXTERNAL_REDIS_URL;
  }

  throw new Error("Redis Server Connection failed...");
};
export const redisStore = new Redis({
  host: "127.0.0.1",
  port: 6379,
  // username: "Kings_Treat",
  // password: "Wonuola28#",
});
