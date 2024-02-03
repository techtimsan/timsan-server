import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "./asyncError.middleware";
import { ErrorHandler } from "../utils";
import { access_token } from "../lib/constants";
import { verifyAccessOrRefreshToken } from "../lib/token";
import { redisStore } from "../lib/redis";
import { prisma } from "../lib/db";

export const isAuthenticated = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies!.access_token as string;
      console.log(accessToken);

      if (!accessToken)
        return next(new ErrorHandler("Login to Access Resource. ", 400));

      const decoded = verifyAccessOrRefreshToken(accessToken, access_token);
      // console.log("mmmmmmmmmmmmm", decoded)

      if (!decoded) return next(new ErrorHandler("Invalid Access Token", 400));
      const userExists = await redisStore.get(decoded.id);

      if (!userExists)
        return next(new ErrorHandler("User does not exist", 400));

      req.user = JSON.parse(userExists);
      return next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// user roles
export const authorizeUserRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role.toLowerCase())) {
      return next(
        new ErrorHandler(
          `${req.user!.role} is Not Allowed to access this Resource`,
          403
        )
      );
    }

    next();
  };
};

export const isAdmin = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user && req.user.isAdmin) {
        return next();
      }

      return next(new ErrorHandler("Unauthorized", 401));
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const isSuperAdmin = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        const superAdmin = await prisma.user.findUnique({
          where: {
            id: req.user.id,
          },
          select: {
            isSuperAdmin: true,
            isAdmin: true,
          },
        });

        if (!superAdmin?.isSuperAdmin) {
          console.log(superAdmin, req.user);
          return next(new ErrorHandler("Be warned - Unauthorized", 401));
        }

        return next();
      }

      return next(new ErrorHandler("Be warned - Unauthorized", 401));
    } catch (error: any) {
      // console.error(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
