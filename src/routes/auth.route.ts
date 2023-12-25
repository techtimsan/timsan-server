import { NextFunction, Response, Router, Request } from "express"
import { validateRequestBody } from "zod-express-middleware"
import { LoginUserSchema, RegisterUserSchema, ResetPasswordSchema, resendVerificationLinkSchema, validateData } from "../lib/validate/auth"
import { registerUser, getAllUsers, deleteUserById, getUserById, loginUser, logoutUser, refreshAccessToken, verifyEmail, emailVerified, resendVerificationEmail, resetPassword } from "../controllers"
import { isAuthenticated } from "../middlewares"
// import {body, query, param, checkSchema} from 'express-validator'


export const authRoute = Router({
  caseSensitive: true,
  strict: true,
})

authRoute.get("/", getAllUsers)
authRoute.post(
  "/register",
  validateData(RegisterUserSchema),
  registerUser
)
authRoute.get("/verified", emailVerified)
authRoute.get("/verify-email/:userId/:confirmationToken", verifyEmail)
authRoute.post("/login", validateData(LoginUserSchema), loginUser) 
authRoute.get("/logout", isAuthenticated, logoutUser)
authRoute.get("/refresh-token", refreshAccessToken)
authRoute.get("/:userId", getUserById)
authRoute.patch("/reset-password/:userId", validateData(ResetPasswordSchema), resetPassword)
authRoute.delete("/:userId", isAuthenticated, deleteUserById)
authRoute.post("/resend-email", validateData(resendVerificationLinkSchema), resendVerificationEmail)

// email verification
