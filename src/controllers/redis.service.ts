import { NextFunction, Request, Response } from "express"
import { asyncErrorMiddleware } from "../middlewares"
import { ErrorHandler } from "../utils"
import { redisStore } from "../lib/redis"

export const getAllRedisData = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = []
      let cursor = "0"

      do {
        const [newCursor, keys] = await redisStore.scan(cursor, "MATCH", "*")

        for (const key of keys) {
          const value = await redisStore.get(key)
          result.push({ key, value })
        }

        cursor = newCursor
      } while (cursor !== "0")

      res.status(200).json({
        message: "Fetched All Redis Data Successfully!",
        data: result,
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

export const getRedisDataById = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params

      const data = await redisStore.get(userId)

      res.status(200).json({
        message: "Fetched User Redis Data Successfully",
        data,
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)
