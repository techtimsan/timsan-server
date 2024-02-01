"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
exports.newsletterRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true
});
exports.newsletterRoute.get("/", controllers_1.getAllNewsletterSubscribers);
exports.newsletterRoute.post("/", controllers_1.subscribeToNewsletter);
