import { NextFunction, Request, Response } from "express"
import { asyncErrorMiddleware } from "../middlewares"
import { prisma } from "../lib/db"
import { ErrorHandler } from "../utils"

type HealthCheckData = {
  name: string
  email: string
  age?: number
}

export const dbHealthCheck = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, age }: HealthCheckData = req.body
      // const healthExists =
      const health = await prisma.healthCheck.create({
        data: {
          name,
          email,
          age,
        },
      })

      res.status(201).json({
        message: "Api - DB Health fine...",
        data: health,
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)
