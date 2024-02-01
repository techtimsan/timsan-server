"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisStore = void 0;
const ioredis_1 = require("ioredis");
const constants_1 = require("../constants");
const redisClient = () => {
    if (constants_1.EXTERNAL_REDIS_URL) {
        console.log("Redis Server Connected Successfully!");
        return constants_1.EXTERNAL_REDIS_URL;
    }
    throw new Error("Redis Server Connection failed...");
};
exports.redisStore = new ioredis_1.Redis("rediss://red-cl7s2sf6e7vc73a0bitg:fxv8R9ir3jNlHMedu8PYYaXX5tjRRjPb@oregon-redis.render.com:6379"); // Default port is 6379
