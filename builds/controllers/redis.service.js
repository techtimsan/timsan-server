"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRedisUserDataById = exports.getRedisDataById = exports.getAllRedisData = void 0;
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
const redis_1 = require("../lib/redis");
exports.getAllRedisData = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const result = [];
        let cursor = "0";
        do {
            const [newCursor, keys] = await redis_1.redisStore.scan(cursor, "MATCH", "*");
            for (const key of keys) {
                const value = await redis_1.redisStore.get(key);
                result.push({ key, value });
            }
            cursor = newCursor;
        } while (cursor !== "0");
        res.status(200).json({
            message: "Fetched All Redis Data Successfully!",
            data: result,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.getRedisDataById = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const data = await redis_1.redisStore.get(userId);
        res.status(200).json({
            message: "Fetched User Redis Data Successfully",
            data,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
// update ? 
exports.deleteRedisUserDataById = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const deletedData = await redis_1.redisStore.del(userId);
        res.status(200).json({
            message: "Deleted Redis data successfully!",
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
