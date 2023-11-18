"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
exports.authRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true,
});
exports.authRoute.get("/", middlewares_1.isAuthenticated, controllers_1.getAllUsers);
exports.authRoute.post("/register", controllers_1.registerUser);
exports.authRoute.post("/confirm-email/:token", controllers_1.confirmEmail); // post?
exports.authRoute.post("/login", controllers_1.loginUser);
exports.authRoute.patch("/verify-email/:accessToken");
exports.authRoute.get("/logout", middlewares_1.isAuthenticated, controllers_1.logoutUser);
exports.authRoute.get("/refresh-token", controllers_1.refreshAccessToken);
exports.authRoute.get("/:userId", controllers_1.getUserById);
exports.authRoute.post("/forgot-password");
exports.authRoute.patch("/reset-password/:accessToken");
exports.authRoute.delete("/:userId", controllers_1.deleteUserById);
