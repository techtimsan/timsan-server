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
exports.redisStore = new ioredis_1.Redis(constants_1.EXTERNAL_REDIS_URL); // Default port is 6379
