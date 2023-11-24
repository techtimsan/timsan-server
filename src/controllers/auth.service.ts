import { NextFunction, Request, Response } from "express"
import { asyncErrorMiddleware } from "../middlewares"
import { ErrorHandler } from "../utils"
import { prisma } from "../lib/db"
import argon2 from "argon2"
import { sendEmail } from "../lib/mail"
import path from "path"
import { LoginUserData, RegisterUserData } from "../types/app"
import {
  BASE_API_URL,
  BASE_SERVER_URL,
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
import argon from "argon2"

export const registerUser = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        accountType,
      }: RegisterUserData = req.body

      switch (accountType) {
        case "MEMBER":
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

          const hashedPassword = await argon.hash(password)

          // create new user
          const user = await prisma.user.create({
            data: {
              firstName,
              lastName,
              email,
              password: hashedPassword,
            },
            select: {
              firstName: true,
              lastName: true,
              email: true,
              emailVerified: true,
            },
          })

          const {
            firstName: firstname,
            lastName: lastname,
            email: emailAddress,
            emailVerified,
          } = user

          // expires in 3 days
          const expiresAt = new Date().getTime() + 3 * 24 * 60 * 60 * 1000

          // generate email confirmation token
          const confirmationToken = generateEmailConfirmationToken({
            email: emailAddress,
            firstName: firstname,
            lastName: lastname,
            emailVerified,
          })

          // save new user to redis
          const redisUserData = await redisStore.set(
            email,
            JSON.stringify({
              firstName,
              lastName,
              email,
              emailVerified,
              token: confirmationToken,
              expiresAt,
            })
          )

          const templateData = {
            firstName,
            emailConfirmationLink: `${BASE_SERVER_URL}${BASE_API_URL}/user/verify-email/${confirmationToken}`,
          }

          // send activation email
          await sendEmail({
            emailAddress: email,
            subject: "Account Activation",
            template: "activation-mail.ejs",
            data: templateData,
          })

          res.status(201).json({
            success: true,
            message: `Check your mail to verify your email address`,
            result: redisUserData,
          })
          break

        default:
          res.status(400).json({
            success: false,
            message: "Invalid account type provided.",
          })
          break
      }
    } catch (error: any) {
      console.log(error)
      return res.status(500).json({
        error: error.message,
      })
    }
  }
)

export const verifyEmail = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, confirmationToken } = req.params

      // check if email is in redis server
      const emailExists = await redisStore.get(email)

      if (!emailExists) {
        const errorMessage = "Email does not exist"
        res.redirect(
          `/api/v1/user/verified/error=false&message=${errorMessage}`
        )
      }

      // check if token is not expired
      const { expiresAt } = JSON.parse(JSON.stringify(email))

      const expired = Date.now() === expiresAt

      if (expired) {
        const errorMessage = "Confirmation Token already expired"
        res.redirect(
          `/api/v1/user/verified/error=false&message=${errorMessage}`
        )
      }

      const verifiedToken = verifyEmailConfirmationToken(confirmationToken)

      if (!verifiedToken) {
        const errorMessage = "Invalid Confirmation Token"
        res.redirect(
          `/api/v1/user/verified/error=false&message=${errorMessage}`
        )
      }

      // const { emailVerified } = verifiedToken

      if (verifiedToken && !verifiedToken.emailVerified) {
        const verifiedUser = await prisma.user.update({
          where: {
            email,
          },
          data: {
            emailVerified: true,
          },
        })

        const successMessage = "Email Verified Successfully"

        res.redirect(
          `/api/v1/user/verified/error=false&message=${successMessage}`
        )
      }

      const verifiedMessage = "Email Already Verified"
      res.redirect(
        `/api/v1/user/verified/error=false&message=${verifiedMessage}`
      )
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      })
    }
  }
)

export const emailVerified = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, message } = req.params
      res.render("email-verified", {
        error,
        message,
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

export const resendVerificationEmail = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email }: { email: string } = req.body

      const isRegisteredUser = await redisStore.get(email)

      if (!isRegisteredUser) {
        res.status(404).json({
          success: false,
          message: "User does not exist",
        })
      }

      const { firstName, lastName, emailVerified } = JSON.parse(
        JSON.stringify(isRegisteredUser)
      )

      if (emailVerified)
        res.status(400).json({
          success: false,
          message: "Email Alredy Verified Successfully",
        })

      // generate email confirmation token
      const confirmationToken = generateEmailConfirmationToken({
        email: email,
        firstName,
        lastName,
        emailVerified,
      })

      const templateData = {
        firstName,
        emailConfirmationLink: `${BASE_SERVER_URL}${BASE_API_URL}/user/confirm-email/${confirmationToken}`,
      }

      // resend email
      await sendEmail({
        emailAddress: email,
        subject: "Account Activation",
        template: "activation-mail.ejs",
        data: templateData,
      })

      // TODO:
      res.status(200).json({
        success: true,
        message: "Verification Email has been re-sent.",
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
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
        message: "Password Reset Successfully",
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
