import { NextFunction, Response, Router, Request } from "express"
import { validateRequestBody } from "zod-express-middleware"
import { LoginUserSchema, RegisterUserSchema, resendVerificationLinkSchema, validateData } from "../lib/validate/auth"
import { registerUser, getAllUsers, deleteUserById, getUserById, loginUser, logoutUser, refreshAccessToken, verifyEmail, emailVerified, resendVerificationEmail } from "../controllers"
import { isAuthenticated, validateFields } from "../middlewares"
// import {body, query, param, checkSchema} from 'express-validator'


export const authRoute = Router({
  caseSensitive: true,
  strict: true,
})

const tester = async (req: Request, res: Response, next: NextFunction) => {
  console.log("middleware working...")

  next()
}

authRoute.get("/", getAllUsers)
authRoute.post(
  "/register",
  validateData(RegisterUserSchema),
  registerUser
)
authRoute.get("/verified", emailVerified)
authRoute.get("/verify-email/:userId/:confirmationToken", verifyEmail)
authRoute.post("/login", validateData(LoginUserSchema), loginUser)
// authRoute.get("/verify-email/:accessToken")
authRoute.get("/logout", isAuthenticated, logoutUser)
authRoute.get("/refresh-token", refreshAccessToken)
authRoute.get("/:userId", getUserById)
authRoute.post("/forgot-password")
authRoute.patch("/reset-password/:accessToken")
authRoute.delete("/:userId", deleteUserById)
authRoute.post("/resendVerificationLink", validateData(resendVerificationLinkSchema), resendVerificationEmail)

// email verification
