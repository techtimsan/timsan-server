"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const auth_1 = require("../lib/validate/auth");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
// import {body, query, param, checkSchema} from 'express-validator'
exports.authRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true,
});
const tester = async (req, res, next) => {
    console.log("middleware working...");
    next();
};
exports.authRoute.get("/", controllers_1.getAllUsers);
exports.authRoute.post("/register", (0, auth_1.validateData)(auth_1.RegisterUserSchema), controllers_1.registerUser);
exports.authRoute.get("/confirm-email/:token", controllers_1.confirmEmail); // post?
exports.authRoute.post("/login", (0, auth_1.validateData)(auth_1.LoginUserSchema), controllers_1.loginUser);
// authRoute.get("/verify-email/:accessToken")
exports.authRoute.get("/logout", middlewares_1.isAuthenticated, controllers_1.logoutUser);
exports.authRoute.get("/refresh-token", controllers_1.refreshAccessToken);
exports.authRoute.get("/:userId", controllers_1.getUserById);
exports.authRoute.post("/forgot-password");
exports.authRoute.patch("/reset-password/:accessToken");
exports.authRoute.delete("/:userId", controllers_1.deleteUserById);
