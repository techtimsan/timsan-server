"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const auth_1 = require("../lib/validate/auth");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
// import {body, query, param, checkSchema} from 'express-validator'
const zod_1 = require("zod");
exports.authRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true,
});
exports.authRoute.get("/", middlewares_1.isAuthenticated, middlewares_1.isAdmin, controllers_1.getAllUsers);
exports.authRoute.post("/register", (0, auth_1.validateData)(auth_1.RegisterUserSchema), controllers_1.registerUser);
exports.authRoute.get("/verified", controllers_1.emailVerified);
exports.authRoute.get("/verify-email/:userId/:confirmationToken", controllers_1.verifyEmail);
exports.authRoute.post("/login", (0, auth_1.validateData)(auth_1.LoginUserSchema), controllers_1.loginUser);
exports.authRoute.get("/logout", middlewares_1.isAuthenticated, controllers_1.logoutUser);
exports.authRoute.get("/refresh-token", controllers_1.refreshAccessToken); // TODO: isAuthenticated?
exports.authRoute.get("/:userId", controllers_1.getUserById);
exports.authRoute.patch("/reset-password/:userId", (0, auth_1.validateData)(auth_1.ResetPasswordSchema), controllers_1.resetPassword);
exports.authRoute.delete("/:userId", (0, auth_1.validateData)(zod_1.z.object({
    userId: zod_1.z.string(),
})), middlewares_1.isAuthenticated, middlewares_1.isSuperAdmin, controllers_1.deleteUserById);
exports.authRoute.post("/resend-email", (0, auth_1.validateData)(auth_1.resendVerificationLinkSchema), middlewares_1.isAuthenticated, controllers_1.resendVerificationEmail);
// email verification
