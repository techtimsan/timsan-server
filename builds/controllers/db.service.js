"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbHealthCheck = void 0;
const middlewares_1 = require("../middlewares");
const db_1 = require("../lib/db");
const utils_1 = require("../utils");
exports.dbHealthCheck = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { email, name, age } = req.body;
        // const healthExists =
        const health = await db_1.prisma.healthCheck.create({
            data: {
                name,
                email,
                age,
            },
        });
        res.status(201).json({
            message: "Api - DB Health fine...",
            data: health,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
