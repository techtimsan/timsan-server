"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const utils_1 = require("../utils");
const errorMiddleware = (err, req, res, next) => {
    try {
        err.statusCode = err.statusCode || 500;
        err.message = err.message || `Internal Server Error`;
        // Define specific errors
        // wrong jwt
        if (err.name === "JsonWebTokenError") {
            const message = `Unauthorized - Invalid Access Token!`;
            err = new utils_1.ErrorHandler(message, 400);
        }
        // jwt expired
        if (err.name === "TokenExpiredError") {
            const message = `Unauthorized - Acess Token Expired!`;
            err = new utils_1.ErrorHandler(message, 400);
        }
        return res.status(err.statusCode).json({
            success: false,
            message: `${err.message}`,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `${err.message}`,
        });
    }
};
exports.errorMiddleware = errorMiddleware;
