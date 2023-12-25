import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { ErrorHandler } from "../utils";
import { prisma } from "../lib/db";

export const subscribeToNewsletter = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email }: { email: string } = req.body;

      const alreadySubscribed = await prisma.newsletter.findUnique({
        where: {
          email,
        },
      });

      if (alreadySubscribed) {
        return res.status(400).json({
          message: "Already Subscribed to Newsletter!",
        });
      }

      const newsletterSubscription = await prisma.newsletter.create({
        data: {
          email,
        },
      });

      res.status(201).json({
        message: "Thanks for Subscribing to our Newsletter!.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllNewsletterSubscribers = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscribers = await prisma.newsletter.findMany({
        select: {
          email: true,
        },
        orderBy: {
          email: "asc",
        },
      });

      res.status(200).json({
        message: "Fetched Newsletter Subscribers Successfully!",
        data: subscribers,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
