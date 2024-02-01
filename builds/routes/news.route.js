"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsRoute = void 0;
const express_1 = require("express");
const auth_1 = require("../lib/validate/auth");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
exports.newsRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true,
});
const tester = async (req, res, next) => {
    console.log("middleware working...");
    next();
};
exports.newsRoute.get("/", controllers_1.getAllNewsPosts);
exports.newsRoute.get("/:postId", controllers_1.getNewsPostById);
exports.newsRoute.post("/createPost", middlewares_1.isAuthenticated, middlewares_1.uploadImage, (0, auth_1.validateData)(auth_1.CreateNewsSchema), controllers_1.createNewsPost);
exports.newsRoute.patch("/editPost/:postId", middlewares_1.isAuthenticated, middlewares_1.uploadImage, (0, auth_1.validateData)(auth_1.CreateNewsSchema), controllers_1.editNewsPost);
exports.newsRoute.delete("/:postId", middlewares_1.isAuthenticated, controllers_1.deleteNewsPost);
// newsRoute.post("/uploadTester", uploadImage, testingCloudUpload)
