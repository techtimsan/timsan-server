import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { ErrorHandler } from "../utils";
import { prisma } from "../lib/db";

export const subscribeToNewsletter = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email }: { email: string } = req.body;

      const alreadySubscribed = await prisma.newsletterSubscription.findFirst({
        where: {
          emailAddress: email,
        },
      });

      if (alreadySubscribed) {
        return res.status(400).json({
          message: "Already Subscribed to Newsletter!",
        });
      }

      const newsletterSubscription = await prisma.newsletterSubscription.create(
        {
          data: {
            emailAddress: email,
          },
        }
      );

      res.status(201).json({
        message: "Thanks for Subscribing to our Newsletter!.",
        data: newsletterSubscription
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllNewsletterSubscribers = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const subscribers = await prisma.newsletterSubscription.findMany({
      //   select: {
      //     emailAddress: true,
      //   },
      //   orderBy: {
      //     emailAddress: "asc",
      //   },
      // });

      res.status(200).json({
        message: "Fetched Newsletter Subscribers Successfully!",
        data: [],
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
