import { NextFunction, Request, Response } from "express"
import { asyncErrorMiddleware } from "../middlewares"
import { ErrorHandler } from "../utils"
import { prisma } from "../lib/db"
import argon2 from "argon2"
import { sendEmail } from "../lib/mail"
import { validateRequestBody } from "zod-express-middleware"
import { RegisterUserSchema } from "../lib/validate/auth"
import { LoginUserData, RegisterUserData } from "../types/app"
import {
  BASE_API_URL,
  access_token,
  access_token_expire,
  refresh_token,
  refresh_token_expire,
} from "../lib/constants"
import {
  accessTokenOptions,
  generateEmailConfirmationToken,
  refreshTokenOptions,
  sendAccessAndRefreshToken,
  signJWTAccessToken,
  verifyAccessOrRefreshToken,
  verifyEmailConfirmationToken,
} from "../lib/token"
import { redisStore } from "../lib/redis"
import jwt from "jsonwebtoken"
import { cloudUpload } from "../lib/upload"
import { checkSchema } from "express-validator"

export const registerUser = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password }: RegisterUserData =
        req.body

      const emailSent = await redisStore.get(email)
      

      if (emailSent)
        return next(new ErrorHandler("Confirmation Email Already sent", 400))

      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          email: true,
        },
      })

      if (emailExists)
        return next(new ErrorHandler("Email already exists", 400))

      // generate email confirmation token
      const confirmationToken = generateEmailConfirmationToken({
        email,
        firstName,
        lastName,
        password,
      })

      const templateData = {
        firstName,
        emailConfirmationLink: `http://localhost:3000${BASE_API_URL}/user/confirm-email/${confirmationToken}`,
      }

      // send activation email
      try {
        await sendEmail({
          emailAddress: email,
          subject: "Account Activation",
          template: "activation-mail.ejs",
          data: templateData,
        })

        // save new user to redis
        const newUser = await redisStore.set(
          email.trim(),
          JSON.stringify({ firstName, lastName, email, emailVerified: false, token: confirmationToken })
        )

        res.status(201).json({
          success: true,
          message: `Kindly check your email to activate your account`,
          token: confirmationToken, // remove later?
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

      // if !token TODO:

      const verifiedUser = verifyEmailConfirmationToken(token)

      if (!verifiedUser)
        return res.status(401).json({
          message: "Invalid Token",
        })

      const { firstName, lastName, email, password } = verifiedUser

      const hashedPassword = await argon2.hash(password)

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          emailVerified: true,
        },
      })

      res.status(200).json({
        message: "Email Address Confirmed 😎",
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      })
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      })
    }
  }
)

export const loginUser = 
asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
  
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
          .redirect("/user/login")
      }

      const isPassword = await argon2.verify(user.password, password)

      if (user && !isPassword) {
        return res.status(401).json({
          message: "Invalid Credentials! 😠",
        })
      }

      const {
        id,
        email: emailAddress,
        emailVerified,
        firstName,
        lastName,
      } = user

      sendAccessAndRefreshToken({ id, firstName, lastName, email }, 200, res)
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
      const userId = req.user?.id || ""
      await redisStore.del(userId)

      res.status(200).json({
        success: true,
        message: "Logged out !",
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

export const refreshAccessToken = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshtoken as string
      const decoded = verifyAccessOrRefreshToken(refreshToken, refresh_token)

      const errorMessage = `Could not Refresh Token`
      if (!decoded) return next(new ErrorHandler(errorMessage, 400))

      const session = await redisStore.get(decoded.user.id)

      if (!session) return next(new ErrorHandler(errorMessage, 400))

      const user = JSON.parse(session)

      req.user = user

      const accessToken = jwt.sign(user, access_token, {
        expiresIn: access_token_expire,
      })

      const newRefreshToken = jwt.sign(user, refresh_token, {
        expiresIn: refresh_token_expire,
      })

      res.cookie("access_token", accessToken, accessTokenOptions)
      res.cookie("refresh_token", newRefreshToken, refreshTokenOptions)

      res.status(200).json({
        success: true,
        accessToken,
      })
    } catch (error: any) {
      
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

export const getAllUsers = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          conferences: {
            select: {
              id: true,
            },
          },
        },
      })

      res.status(200).json({
        message: "Fetched Users Successfully!",
        data: users,
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
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

      const { password, ...userWithoutPassword } = user!

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

export const resetPassword = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        oldPassword,
        newPassword,
      }: {
        oldPassword: string
        newPassword: string
      } = req.body

      const userId = req.user?.id

      if (!userId) {
        return next(new ErrorHandler("Not Authenticated", 400))
      }

      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      })

      if (!user) return next(new ErrorHandler("", 400))

      if (user.password === undefined || user.password === "") {
        return next(new ErrorHandler("Invalid User", 400))
      }

      const isPasswordMatch = argon2.verify(oldPassword, user.password)

      if (!isPasswordMatch)
        return next(new ErrorHandler("Invalid Credentials", 400))

      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: newPassword,
        },
      })

      await redisStore.set(user.id, JSON.stringify(updatedUser))

      res.status(200).json({
        success: true,
        message: "Reset Password Successfully",
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// update profile picture / avatar
export const updateProfilePic = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatarUrl }: { avatarUrl: string } = req.body

      const userId = req.user?.id

      if (!userId) return next(new ErrorHandler("", 400))

      const avatar = await cloudUpload.uploader.upload("", {
        folder: "avatars",
      })

      // TODO: Install Cloudinary / Cloud Provider
      const user = await prisma.memberProfile.update({
        where: {
          id: userId,
        },
        data: {
          avatarUrl: avatar.secure_url,
        },
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

// get user information
export const getUserInfo = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const userId = req.user?.id
      // getUserById(userId, res, next)
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)
