import { Redis } from "ioredis";
import { EXTERNAL_REDIS_URL } from "../constants";

export const redisClient = () => {
  console.log(EXTERNAL_REDIS_URL)
  if (EXTERNAL_REDIS_URL) {
    console.log("Redis Server Connected Successfully!");
    return EXTERNAL_REDIS_URL;
  }

  throw new Error("Redis Server Connection failed...");
};
export const redisStore = new Redis(EXTERNAL_REDIS_URL);
