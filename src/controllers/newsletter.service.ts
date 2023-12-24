import { NextFunction, Response } from "express"
import { asyncErrorMiddleware } from "../middlewares"
import { ErrorHandler } from "../utils"
import { prisma } from "../lib/db"

export const subscribeToNewsletter = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const { email }: { email: string } = req.body

        // const alreadySubscribed = await prisma

        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
  }
)
