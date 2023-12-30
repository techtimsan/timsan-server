"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExcoProfile = exports.updateExcoProfile = exports.getExcoByEmail = exports.getAllExcos = exports.createExcoProfile = void 0;
const middlewares_1 = require("../middlewares");
const db_1 = require("../lib/db");
const utils_1 = require("../utils");
exports.createExcoProfile = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const {} = req.body;
        res.status(200).json({
            message: "Work on endpoint"
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.getAllExcos = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const excos = await db_1.prisma.excoProfile.findMany();
        return res.status(200).json({
            message: "Fetched Excos Successfully! 😊",
            data: excos
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.getExcoByEmail = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        res.status(200).json({
            message: "work on endpoint"
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.updateExcoProfile = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        res.status(200).json({
            message: "work on endpoint"
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.deleteExcoProfile = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        res.status(200).json({
            message: "work on endpoint"
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
