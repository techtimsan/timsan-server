import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { ErrorHandler } from "../utils";
import { prisma } from "../lib/db";
import argon2 from "argon2";
import { sendEmail } from "../lib/mail";
import path from "path";
import { LoginUserData, RegisterUserData } from "../types/app";
import {
  BASE_API_URL,
  BASE_SERVER_URL,
  access_token,
  access_token_expire,
  refresh_token,
  refresh_token_expire,
} from "../lib/constants";
import {
  accessTokenOptions,
  generateEmailConfirmationToken,
  refreshTokenOptions,
  sendAccessAndRefreshToken,
  signJWTAccessToken,
  verifyAccessOrRefreshToken,
  verifyEmailConfirmationToken,
} from "../lib/token";
import { redisStore } from "../lib/redis";
import jwt from "jsonwebtoken";
import { cloudUpload } from "../lib/upload";
import argon from "argon2";
import { User } from "@prisma/client";

export const registerUser = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        accountType,
      }: RegisterUserData = req.body;

      switch (accountType) {
        case "MEMBER":
          const emailExists = await prisma.user.findUnique({
            where: {
              email,
            },
            select: {
              email: true,
            },
          });

          if (emailExists)
            return next(new ErrorHandler("Email already exists", 400));

          const hashedPassword = await argon.hash(password);

          // create new user
          const user = await prisma.user.create({
            data: {
              firstName,
              lastName,
              email,
              password: hashedPassword,
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              emailVerified: true,
            },
          });

          const {
            id: userId,
            firstName: firstname,
            lastName: lastname,
            email: emailAddress,
            emailVerified,
          } = user;
          // expires in 3 days
          const expiresAt = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;

          // generate email confirmation token
          const confirmationToken = generateEmailConfirmationToken({
            email: emailAddress,
            firstName: firstname,
            lastName: lastname,
            emailVerified,
          });

          // save new user to redis
          const redisUserData = await redisStore.set(
            userId,
            JSON.stringify({
              userId,
              id: userId,
              firstName,
              lastName,
              email,
              emailVerified,
              token: confirmationToken,
              expiresAt,
            })
          );

          const templateData = {
            firstName,
            emailConfirmationLink: `${BASE_SERVER_URL}${BASE_API_URL}/user/verify-email/${userId}/${confirmationToken}`,
          };

          // send activation email
          await sendEmail({
            emailAddress: email,
            subject: "Account Activation",
            template: "activation-mail.ejs",
            data: templateData,
          });

          res.status(201).json({
            success: true,
            message: `Check your mail to verify your email address`,
            result: redisUserData,
            link: templateData.emailConfirmationLink,
          });
          break;

        default:
           next(new ErrorHandler("Invalid account type provided.", 400));
           break
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const verifyEmail = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, confirmationToken } = req.params;

      // check if email is in redis server
      const userExists = await redisStore.get(userId);

      if (!userExists) {
        const errorMessage = "Email does not exist";
        res.redirect(
          `${BASE_SERVER_URL}/api/v1/user/verified?error=true&message=${errorMessage}`
        );
      }

      // check if token is not expired
      const userData = JSON.parse(userExists as string);

      const expired = Date.now() >= userData.expiresAt;

      if (expired) {
        const errorMessage = "Confirmation Token already expired";
        res.redirect(
          `${BASE_SERVER_URL}/api/v1/user/verified?error=true&message=${errorMessage}`
        );
      }

      const verifiedToken = verifyEmailConfirmationToken(confirmationToken);

      if (!verifiedToken) {
        const errorMessage = "Invalid Confirmation Token";
        res.redirect(
          `${BASE_SERVER_URL}/api/v1/user/verified?error=true&message=${errorMessage}`
        );
      }

      if (verifiedToken && userData.emailVerified !== true) {
        const verifiedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            emailVerified: true,
          },
        });

        console.log("verified user : ", verifiedUser);

        // update redis data
        userData.emailVerified = verifiedUser.emailVerified;
        const verifiedUserData = JSON.stringify(userData);
        const updatedRedisUserData = await redisStore.set(
          userId,
          verifiedUserData
        );

        const successMessage = "Email Verified Successfully";

        res.redirect(
          `${BASE_SERVER_URL}/api/v1/user/verified?error=false&message=${successMessage}`
        );
      } else {
        const verifiedMessage = "Email Already Verified";
        res.redirect(
          `${BASE_SERVER_URL}/api/v1/user/verified?error=true&message=${verifiedMessage}`
        );
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const emailVerified = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, message } = req.query;

      const errorStatus = error === "true" ? true : false;

      res.render("email-verified", {
        error: errorStatus,
        message,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const resendVerificationEmail = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email }: { email: string } = req.body;

      const isRegisteredUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!isRegisteredUser) {
       return next(new ErrorHandler("User does not exist!", 400))
      }

      const {
        id: userId,
        firstName,
        lastName,
        emailVerified,
      } = JSON.parse(JSON.stringify(isRegisteredUser));

      if (emailVerified)
        res.status(400).json({
          success: false,
          message: "Email Alredy Verified Successfully",
        });

      // generate email confirmation token
      const confirmationToken = generateEmailConfirmationToken({
        email: email,
        firstName,
        lastName,
        emailVerified,
      });

      const templateData = {
        firstName,
        emailConfirmationLink: `${BASE_SERVER_URL}${BASE_API_URL}/user/verify-email/${userId}/${confirmationToken}`,
      };

      // resend email
      await sendEmail({
        emailAddress: email,
        subject: "Account Activation",
        template: "activation-mail.ejs",
        data: templateData,
      });

      // TODO:
      return res.status(200).json({
        message: "Verification Email has been re-sent."
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const loginUser = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: LoginUserData = req.body;

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
      });

      if (!user) {
        return next(new ErrorHandler("Invalid Credentials! 😠", 400));
      }

      if (user && !user.emailVerified) {
        return next(
          new ErrorHandler(
            "Check your mail to verify your email address ⚠",
            401
          )
        );
        // .redirect("/user/login")
      }

      const isPassword = await argon2.verify(user.password, password);

      if (user && !isPassword) {
        return next(new ErrorHandler("Invalid Credentials! 😠", 401));
      }

      const {
        id,
        email: emailAddress,
        emailVerified,
        firstName,
        lastName,
      } = user;

      sendAccessAndRefreshToken({ id, firstName, lastName, email }, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const logoutUser = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      // delete redis store value
      const userId = req.user?.id || "";
      await redisStore.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out !",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const refreshAccessToken = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshtoken as string;
      const decoded = verifyAccessOrRefreshToken(refreshToken, refresh_token);

      const errorMessage = `Could not Refresh Token`;
      if (!decoded) return next(new ErrorHandler(errorMessage, 400));

      const session = await redisStore.get(decoded.id);

      if (!session) return next(new ErrorHandler(errorMessage, 400));

      const user = JSON.parse(session);

      req.user = user;

      const accessToken = jwt.sign(user, access_token, {
        expiresIn: access_token_expire,
      });

      const newRefreshToken = jwt.sign(user, refresh_token, {
        expiresIn: refresh_token_expire,
      });

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", newRefreshToken, refreshTokenOptions);

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllUsers = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          emailVerified: true,
          conferences: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          lastName: "asc",
        },
      });

      res.status(200).json({
        message: "Fetched Users Successfully!",
        data: users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getUserById = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          firstName: true,
          lastName: true,
          conferences: true,
          email: true,
          emailVerified: true,
          password: true,
          isAdmin: true,
          isSuperAdmin: true
        },
      });

      if (!user) {
        return next(new ErrorHandler("User does not exist!", 400))
      }

      const { password, ...userWithoutPassword } = user!;

      res.status(200).json({
        message: "Fetched user successfully!",
        data: userWithoutPassword,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
);

export const deleteUserById = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      const user = await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      // delete user redis data
      await redisStore.del(userId);

      res.status(200).json({
        message: "Deleted User Successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
);

export const resetPassword = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        oldPassword,
        newPassword,
      }: {
        oldPassword: string;
        newPassword: string;
      } = req.body;

      const userId = req.user?.id;

      if (!userId) {
        return next(new ErrorHandler("Not Authenticated", 400));
      }

      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) return next(new ErrorHandler("", 400));

      if (user.password === undefined || user.password === "") {
        return next(new ErrorHandler("Invalid User", 400));
      }

      const isPasswordMatch = argon2.verify(oldPassword, user.password);

      if (!isPasswordMatch)
        return next(new ErrorHandler("Invalid Credentials", 400));

      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: newPassword,
        },
      });

      await redisStore.set(user.id, JSON.stringify(updatedUser));

      res.status(200).json({
        success: true,
        message: "Password Reset Successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// forgot password
export const forgotPassword = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email}: { email: string} = req.body

    const user = await prisma.user.findUnique({
      where: {
        email
      },
   select: {
    email: true
   }
    })

    if (!user) {
      return next(new ErrorHandler("Invalid Credentials", 400))
    }

    // send email
    const link = {
            forgotPasswordLink: `https://timsan.com.ng/forgot-password?token=`
    }
    
    await sendEmail({
      emailAddress: email,
      subject: "Forgot Password",
      template: "forgot-password.ejs", // TODO: create file
      data: {}
    })

    res.status(200).json({
      message: "Reset Password - Email has been sent! to your Email..."
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})

// update profile picture / avatar
export const updateProfilePic = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatarUrl }: { avatarUrl: string } = req.body;

      const userId = req.user?.id;

      if (!userId) return next(new ErrorHandler("", 400));

      const avatar = await cloudUpload.uploader.upload("", {
        folder: "avatars",
      });

      // TODO: Install Cloudinary / Cloud Provider
      const user = await prisma.memberProfile.update({
        where: {
          id: userId,
        },
        data: {
          avatarUrl: avatar.secure_url,
        },
      });

      res.status(200).json({
        message: "Updated Profile pic successfully"
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user information
export const getUserInfo = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const userId = req.user?.id
      // getUserById(userId, res, next)

      res.status(200).json({
        message: "Work on this endpoint..."
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const assignAdminOrSuperAdmin = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      id, role, profileStatus, isAdmin, isSuperAdmin
    }: User = req.body

    const userExists = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!userExists) return next(new ErrorHandler("Invalid credentials - Nonexistent", 400))

    const updatedUser = await prisma.user.update({
      where: {
        id
      },
      data: {
        isAdmin, isSuperAdmin
      }
    })

    res.status(200).json({
      message: "Updated User Successfully",
      data: updatedUser
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})