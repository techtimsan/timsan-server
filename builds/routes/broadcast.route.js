"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastRoute = void 0;
const express_1 = require("express");
const auth_1 = require("../lib/validate/auth");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
exports.broadcastRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true,
});
const tester = async (req, res, next) => {
    console.log("middleware working...");
    next();
};
exports.broadcastRoute.get("/", controllers_1.getAllBroadcasts);
exports.broadcastRoute.get("/:broadcastId", controllers_1.getBroadcastById);
exports.broadcastRoute.post("/createBroadcast", middlewares_1.uploadImage, (0, auth_1.validateData)(auth_1.CreateBroadCastSchema), controllers_1.createBroadcast);
exports.broadcastRoute.patch("/editBroadcast/:broadcastId", middlewares_1.uploadImage, (0, auth_1.validateData)(auth_1.CreateBroadCastSchema), controllers_1.editBroadcast);
exports.broadcastRoute.delete("/:broadcastId", controllers_1.deleteBroadcast);
// test commit update
exports.broadcastRoute.put("/test");
