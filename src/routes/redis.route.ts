import { NextFunction, Response, Router, Request } from "express"
import { validateRequestBody } from "zod-express-middleware"
import {   getAllRedisData, getRedisDataById, } from "../controllers"


export const redisRoute = Router({
  caseSensitive: true,
  strict: true,
})

const tester = async (req: Request, res: Response, next: NextFunction) => {
  console.log("middleware working...")

  next()
}

redisRoute.get("/", getAllRedisData)
redisRoute.get("/:id", getRedisDataById)

