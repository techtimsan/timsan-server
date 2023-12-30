"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
exports.adminRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true,
});
// news
exports.adminRoute.post("/", middlewares_1.isAuthenticated, middlewares_1.isAdmin);
exports.adminRoute.patch("/news/update/:newsId", middlewares_1.isAuthenticated, middlewares_1.isAdmin);
exports.adminRoute.delete("/news/delete/:newsId", middlewares_1.isAuthenticated, middlewares_1.isAdmin);
// broadcasts
exports.adminRoute.post("/broadcast/create", middlewares_1.isAuthenticated, middlewares_1.isAdmin);
exports.adminRoute.patch("/broadcast/update/:broadcastId", middlewares_1.isAuthenticated, middlewares_1.isAdmin);
exports.adminRoute.delete("/broadcast/delete/:broadcastId", middlewares_1.isAuthenticated, middlewares_1.isAdmin);
