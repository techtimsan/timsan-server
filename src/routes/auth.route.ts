import { NextFunction, Response, Router, Request } from "express"
import { validateRequestBody } from "zod-express-middleware"
import { LoginUserSchema, RegisterUserSchema, validateLoginUserData, validateRegisterUserData } from "../lib/validate/auth"
import { registerUser, confirmEmail, getAllUsers, deleteUserById, getUserById, loginUser, logoutUser, refreshAccessToken } from "../controllers"
import { isAuthenticated, validateFields } from "../middlewares"
import {body, query, param, checkSchema} from 'express-validator'


export const authRoute = Router({
  caseSensitive: true,
  strict: true,
})

const tester = async (req: Request, res: Response, next: NextFunction) => {
  console.log("middleware working...")

  next()
}

authRoute.get("/",isAuthenticated, getAllUsers)
authRoute.post(
  "/register",
  registerUser
)
authRoute.get("/confirm-email/:token", confirmEmail) // post?
authRoute.post("/login", validateLoginUserData(LoginUserSchema), loginUser)
// authRoute.get("/verify-email/:accessToken")
authRoute.get("/logout", isAuthenticated, logoutUser)
authRoute.get("/refresh-token", refreshAccessToken)
authRoute.get("/:userId", getUserById)
authRoute.post("/forgot-password")
authRoute.patch("/reset-password/:accessToken")
authRoute.delete("/:userId", deleteUserById)