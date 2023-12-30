"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
exports.profileRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true
});
exports.profileRoute.get("/institution", controllers_1.getAllInstitutions);
