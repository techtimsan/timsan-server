import { NextFunction, Request, Response } from "express"
import { asyncErrorMiddleware } from "./asyncError.middleware"
import { ErrorHandler } from "../utils"
import { access_token } from "../lib/constants"
import { verifyAccessOrRefreshToken } from "../lib/token"

export const isAuthenticated = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies!.access_token as string

      if (!accessToken)
        res.status(401).json({
          message: "Login to Access Resource. ",
        })

      const decoded = verifyAccessOrRefreshToken(accessToken, access_token)

      if (!decoded) return next(new ErrorHandler("Invalid Access Token", 400))

      //   const user = await redisStore.get(decoded.user.id)

      const user = decoded.user

      //   if (!user) return next(new ErrorHandler("User does not exist", 400))

      req.user.id = user.id
      next()
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// user roles
export const authorizeUserRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role.toLowerCase())) {
      return next(
        new ErrorHandler(
          `${req.user!.role} is Not Allowed to access this Resource`,
          403
        )
      )
    }

    next()
  }
}

export const isAdmin = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error: any) {}
  }
)
