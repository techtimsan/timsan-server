"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTiletCourses = exports.addTiletCourse = void 0;
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
const db_1 = require("../lib/db");
exports.addTiletCourse = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { thumbnailUrl, title, date, level, rating, instructor, } = req.body;
        const courseExists = await db_1.prisma.tiletCourse.findFirst({
            where: {
                title,
            },
        });
        if (courseExists)
            return next(new utils_1.ErrorHandler("Course with Title Already Exists", 400));
        const newCourse = await db_1.prisma.tiletCourse.create({
            data: {
                thumbnailUrl,
                title,
                date,
                level,
                rating,
                instructor,
            },
        });
        res.status(201).json({
            message: "Tilet Session / Course Added Successfully",
            data: newCourse,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.getAllTiletCourses = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const tiletCourses = await db_1.prisma.tiletCourse.findMany();
        res.status(200).json({
            message: "Fetched Tilet Sessions / Courses Successfully",
            data: tiletCourses,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
