"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = exports.isAdmin = exports.authorizeUserRoles = exports.isAuthenticated = void 0;
const asyncError_middleware_1 = require("./asyncError.middleware");
const utils_1 = require("../utils");
const constants_1 = require("../lib/constants");
const token_1 = require("../lib/token");
const redis_1 = require("../lib/redis");
const db_1 = require("../lib/db");
exports.isAuthenticated = (0, asyncError_middleware_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;
        if (!accessToken)
            return next(new utils_1.ErrorHandler("Login to Access Resource. ", 400));
        const decoded = (0, token_1.verifyAccessOrRefreshToken)(accessToken, constants_1.access_token);
        if (!decoded)
            return next(new utils_1.ErrorHandler("Invalid Access Token", 400));
        const userExists = await redis_1.redisStore.get(decoded.id);
        if (!userExists)
            return next(new utils_1.ErrorHandler("User does not exist", 400));
        req.user = JSON.parse(userExists);
        return next();
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
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return next(new utils_1.ErrorHandler("Unauthorized", 401));
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.isSuperAdmin = (0, asyncError_middleware_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        if (req.user) {
            const superAdmin = await db_1.prisma.user.findUnique({
                where: {
                    id: req.user.id
                },
                select: {
                    isSuperAdmin: true,
                    isAdmin: true
                }
            });
            if (!superAdmin?.isSuperAdmin) {
                console.log(superAdmin, req.user);
                return next(new utils_1.ErrorHandler("Be warned - Unauthorized", 401));
            }
            return next();
        }
        return next(new utils_1.ErrorHandler("Be warned - Unauthorized", 401));
    }
    catch (error) {
        // console.error(error);
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
