"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
exports.redisRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true,
});
const tester = async (req, res, next) => {
    console.log("middleware working...");
    next();
};
exports.redisRoute.get("/", controllers_1.getAllRedisData);
exports.redisRoute.get("/:userId", controllers_1.getRedisDataById);
exports.redisRoute.delete("/:userId", controllers_1.deleteRedisUserDataById);
