import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { ErrorHandler } from "../utils";
import { prisma } from "../lib/db";

export type TiletCourseProps = {
  thumbnailUrl: string;
  title: string;
  date: Date;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  rating: number;
  instructor: string;
};

export const addTiletCourse = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        thumbnailUrl,
        title,
        date,
        level,
        rating,
        instructor,
      }: TiletCourseProps = req.body;

      const courseExists = await prisma.tiletCourse.findFirst({
        where: {
          title,
        },
      });

      if (courseExists)
        return next(new ErrorHandler("Course with Title Already Exists", 400));

      const newCourse = await prisma.tiletCourse.create({
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllTiletCourses = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tiletCourses = await prisma.tiletCourse.findMany();

      res.status(200).json({
        message: "Fetched Tilet Sessions / Courses Successfully",
        data: tiletCourses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
