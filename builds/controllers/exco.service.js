"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExcoProfile = exports.updateExcoProfile = exports.getExcoByEmail = exports.getAllExcos = exports.createExcoProfile = void 0;
const middlewares_1 = require("../middlewares");
const db_1 = require("../lib/db");
exports.createExcoProfile = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const {} = req.body;
    }
    catch (error) {
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
    }
});
exports.getExcoByEmail = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
    }
    catch (error) {
    }
});
exports.updateExcoProfile = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
    }
    catch (error) {
    }
});
exports.deleteExcoProfile = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
    }
    catch (error) {
    }
});
