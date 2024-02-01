"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiletsRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_1 = require("../lib/validate/auth");
exports.tiletsRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true
});
exports.tiletsRoute.post("/", (0, auth_1.validateData)(auth_1.TiletsCourseSchema), controllers_1.addTiletCourse);
exports.tiletsRoute.get("/", controllers_1.getAllTiletCourses);
