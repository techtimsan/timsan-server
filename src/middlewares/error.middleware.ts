import { NextFunction, Request, Response } from "express"
import { ErrorHandler } from "../utils"

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    err.statusCode = err.statusCode || 500
    err.message = err.message || `Internal Server Error`

    // Define specific errors 

    // wrong jwt
    if (err.name === "JsonWebTokenError") {
      const message = `Unauthorized - Invalid Access Token!`
      err = new ErrorHandler(message, 400)
    }

    // jwt expired
    if (err.name === "TokenExpiredError") {
      const message = `Unauthorized - Acess Token Expired!`
      err = new ErrorHandler(message, 400)
    }

    return res.status(err.statusCode).json({
      success: false,
      message: `${err.message}`,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: `${err.message}`,
    })
  }
}
