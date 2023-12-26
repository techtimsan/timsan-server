import { Router } from "express";
import { addTiletCourse, getAllTiletCourses } from "../controllers";
import { TiletsCourseSchema, validateData } from "../lib/validate/auth";

export const tiletsRoute = Router({
    caseSensitive: true,
    strict: true
})

tiletsRoute.post("/", validateData(TiletsCourseSchema), addTiletCourse)
tiletsRoute.get("/", getAllTiletCourses)
