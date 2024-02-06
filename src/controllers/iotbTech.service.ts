import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { prisma } from "../lib/db";
import { sendEmail } from "../lib/mail";
import { ErrorHandler } from "../utils";
import { tryCatch } from "bullmq";
import { IOTBTechApplication } from "../types/app";

//apply for iotb-tech-fellowship
export const registerForTechFellowship = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        currentJobSituation,
        stateOfResidence,
        userId,
        institutionOrCompany,
        educationalBackground,
        itSkillLevel,
        specialization,
        mentor,
        ownLaptop,
        laptopSpec,
        committed,
        challenge,
        techJourney,
        realtimeSolution,
        collaborationTool,
        feedbackAndInquiry,
        stack,
        emailAddress,
      }: IOTBTechApplication = req.body;

      const alreadyRegistered = await prisma.iOTBTechFellowship.findFirst({
        where: {
          userId,
        },
        include: {
          user: true,
        },
      });

      // confirm email address
      // if (alreadyRegistered?.user.email !== emailAddress)
      //   return next(new ErrorHandler("Invalid Email Address", 400));

      if (alreadyRegistered)
        return next(
          new ErrorHandler("Already Registered for this Cohort", 400)
        );

      const newApplication = await prisma.iOTBTechFellowship.create({
        data: {
          currentJobSituation,
          stateOfResidence,
          userId,
          institutionOrCompany,
          educationalBackground,
          itSkillLevel,
          specialization,
          mentor,
          ownLaptop,
          laptopSpec,
          committed,
          challenge,
          techJourney,
          realtimeSolution,
          collaborationTool,
          feedbackAndInquiry,
          stack,
        },
      });

      const applicantDetails = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      const name = applicantDetails?.firstName;

      const fellowshipMailData = {
        shortName: "IOTB-Techpreneur",
        firstName: name,
      };

      try {
        await sendEmail({
          emailAddress,
          subject: "IOTB TECH Fellowship 2024 Registration",
          template: "tech-fellowship-mail.ejs",
          data: fellowshipMailData,
        });

        res.status(200).json({
          success: true,
          message: "TECH Fellowship Registration Successful! 📧 ",
          data: newApplication,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
