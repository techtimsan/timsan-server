import { NextFunction, Request, Response } from "express"
import { asyncErrorMiddleware } from "../middlewares"
import { ErrorHandler } from "../utils"
import { prisma } from "../lib/db"
import argon2 from "argon2"
import { sendEmail } from "../lib/mail"
import { validateRequestBody } from "zod-express-middleware"
import { RegisterUserSchema } from "../lib/validate/auth"
import { LoginUserData, RegisterUserData } from "../types/app"
import { BASE_API_URL, access_token, refresh_token } from "../lib/constants"
import {
  accessTokenOptions,
  generateEmailConfirmationToken,
  refreshTokenOptions,
  verifyEmailConfirmationToken,
} from "../lib/token"

export const registerUser = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password }: RegisterUserData =
        req.body

      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          email: true,
        },
      })

      const hashedPassword = await argon2.hash(password)

      if (userExists) {
        return res.status(400).json({
          message: "Email Already Exists!",
        })
      }

      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
        },
      })

      // generate email confirmation token
      const confirmationToken = generateEmailConfirmationToken({
        id: user.id,
        emailAddress: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })

      console.log(confirmationToken)

      const templateData = {
        firstName,
        emailConfirmationLink: `${BASE_API_URL}/user/confirm-email/${confirmationToken}`,
      }

      // send activation email
      try {
        await sendEmail({
          emailAddress: "omaralli8088@gmail.com",
          subject: "Account Activation",
          template: "activation-mail.ejs",
          data: templateData,
        })

        res.status(201).json({
          success: true,
          message: `Kindly check your email to activate your account`,
        })
      } catch (error: any) {
        res.status(400).json({
          error: error.message,
        })
      }
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      })
    }
  }
)

export const confirmEmail = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params

      const user = verifyEmailConfirmationToken(token)

      if (!user)
        return res.status(401).json({
          message: "Invalid Token",
        })

      // update user in DB
      const userEmailConfirmed = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          // no need for emailToken?
          emailVerified: true,
        },
      })

      const { id, email, firstName, lastName } = userEmailConfirmed

      res.status(200).json({
        message: "Email Address Confirmed 😎",
        data: {
          id,
          email,
          firstName,
          lastName,
          iat: user.iat,
          exp: user.exp,
        },
      })
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      })
    }
  }
)

export const loginUser = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: LoginUserData = req.body

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          password: true,
          email: true,
          emailVerified: true,
        },
      })

      if (!user) {
        return res.status(404).json({
          message: "Invalid Credentials! 😠",
        })
      }

      if (user && !user.emailVerified) {
        return res
          .status(401)
          .json({
            message: "Verify your email! ⚠",
          })
          .redirect("")
      }

      const isPassword = await argon2.verify(user.password, password)

      if (!isPassword) {
        return res.status(401).json({
          message: "Invalid Credentials! 😠",
        })
      }

      const accessToken = ""
      const refreshToken = ""

      const {
        id,
        email: emailAddress,
        emailVerified,
        firstName,
        lastName,
      } = user

      return res.status(200).json({
        message: "Logged in Successfully!",
        data: {
          id,
          emailAddress,
          emailVerified,
          firstName,
          lastName,
        },
      })
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      })
    }
  }
)

// logout user
export const logoutUser = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 })
      res.cookie("refresh_token", "", { maxAge: 1 })

      // delete redis store value
      const userId = req.user?.id
      // redisStore.del(userId)

      res.status(200).json({
        success: true,
        message: "Logged out !",
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// export const refreshAccessToken = asyncErrorMiddleware(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const refreshToken = req.cookies.refreshtoken as string
//       const decoded = verifyAccessOrRefreshToken(refreshToken, refresh_token)

//       const errorMessage = `Could not Refresh Token`
//       if (!decoded) return next(new ErrorHandler(errorMessage, 400))

//       // const session = await redisStore.get(decoded.user.id)

//       if (!session) return next(new ErrorHandler(errorMessage, 400))

//       const user = JSON.parse(session)

//       req.user = user

//       const accessToken = verifyAccessOrRefreshToken(user.id, access_token)

//       const newRefreshToken = verifyAccessOrRefreshToken(user.id, refresh_token)

//       res.cookie("access_token", accessToken, accessTokenOptions)
//       res.cookie("refresh_token", newRefreshToken, refreshTokenOptions)

//       res.status(200).json({
//         success: true,
//         accessToken,
//       })
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400))
//     }
//   }
// )

export const getAllUsers = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany()

      res.status(200).json({
        message: "Fetched Users Successfully!",
        data: users,
      })
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      })
    }
  }
)

export const getUserById = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user) {
        res.status(404).json({
          message: "User does not exist!",
        })
      }

      const { password, ...userWithoutPassword  } = user!

      res.status(200).json({
        message: "Fetched user successfully!",
        data: userWithoutPassword,
      })
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      })
    }
  }
)

export const deleteUserById = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params

      const user = await prisma.user.delete({
        where: {
          id: userId,
        },
      })

      res.status(200).json({
        message: "Deleted User Successfully!",
      })
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      })
    }
  }
)
