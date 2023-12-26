import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { prisma } from "../lib/db";
import { ErrorHandler } from "../utils";
import { InstitutionProfileData } from "../types/app";

export const addInstitution = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        institutionName,
        zone,
        acronym,
        address,
        lat,
        long,
        email,
        state,
        phoneNumber,
      }: InstitutionProfileData = req.body;

      // const alreadyExists = await prisma.institutionProfile.findFirst({
      //   where: {
      //     institutionName,
      //   },
      // });

      // if (alreadyExists) {
      //   return next(new ErrorHandler("Institution Already Exists!", 400))
      // }

      // const institution = await prisma.institutionProfile.create({
      //   data: {
      //     institutionName,
      //     acronym,
      //     address,
      //     lat,
      //     long,
      //     zone,
      //     email,
      //     state,
      //     phoneNumber,
      //     stateProfileId: "",
      //     userId: "",
      //   },
      // });

      res.status(200).json({
        message: "Good"
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllInstitutions = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const institutions = await prisma.institutionProfile.findMany({
      //   select: {
      //     institutionName: true,
      //     lat: true,
      //     long: true,
      //   },
      // });

      res.status(200).json({
        message: "Fetched Institutions Successfully!",
        data: [],
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
