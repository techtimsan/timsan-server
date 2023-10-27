import { asyncErrorMiddleware } from "@/middlewares"
import { ErrorHandler } from "@/utils"
import { NextFunction } from "express"

export const registerMember = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)
