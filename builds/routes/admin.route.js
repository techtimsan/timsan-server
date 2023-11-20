"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = void 0;
const express_1 = require("express");
exports.adminRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true,
});
// news
exports.adminRoute.post("/news/create");
exports.adminRoute.patch("/news/update/:newsId");
exports.adminRoute.delete("/news/delete/:newsId");
// broadcasts
exports.adminRoute.post("/broadcast/create");
exports.adminRoute.patch("/broadcast/update/:broadcastId");
exports.adminRoute.delete("/broadcast/delete/:broadcastId");
