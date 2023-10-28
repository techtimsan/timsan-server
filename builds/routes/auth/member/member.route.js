"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMember = void 0;
const middlewares_1 = require("@/middlewares");
const utils_1 = require("@/utils");
exports.registerMember = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
