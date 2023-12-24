import { Redis } from "ioredis"
import { EXTERNAL_REDIS_URL } from "../constants"

const redisClient = () => {
  if (EXTERNAL_REDIS_URL) {
    console.log("Redis Server Connected Successfully!")
    return EXTERNAL_REDIS_URL
  }

  throw new Error("Redis Server Connection failed...")
}
export const redisStore = new Redis("rediss://red-cl7s2sf6e7vc73a0bitg:fxv8R9ir3jNlHMedu8PYYaXX5tjRRjPb@oregon-redis.render.com:6379") // Default port is 6379
