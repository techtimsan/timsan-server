"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authorizeUserRoles = exports.isAuthenticated = void 0;
const asyncError_middleware_1 = require("./asyncError.middleware");
const utils_1 = require("../utils");
const constants_1 = require("../lib/constants");
const token_1 = require("../lib/token");
const redis_1 = require("../lib/redis");
exports.isAuthenticated = (0, asyncError_middleware_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;
        if (!accessToken)
            res.status(401).json({
                message: "Login to Access Resource. ",
            });
        const decoded = (0, token_1.verifyAccessOrRefreshToken)(accessToken, constants_1.access_token);
        if (!decoded)
            return next(new utils_1.ErrorHandler("Invalid Access Token", 400));
        const user = await redis_1.redisStore.get(decoded.user.id);
        if (!user)
            return next(new utils_1.ErrorHandler("User does not exist", 400));
        req.user = JSON.parse(user);
        next();
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
// user roles
const authorizeUserRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role.toLowerCase())) {
            return next(new utils_1.ErrorHandler(`${req.user.role} is Not Allowed to access this Resource`, 403));
        }
        next();
    };
};
exports.authorizeUserRoles = authorizeUserRoles;
exports.isAdmin = (0, asyncError_middleware_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
    }
    catch (error) { }
});
