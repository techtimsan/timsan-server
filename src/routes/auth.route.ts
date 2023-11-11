import { Router } from "express"
import { validateRequestBody } from "zod-express-middleware"
import { RegisterUserSchema, validateLoginUserData, validateRegisterUserData } from "../lib/validate/auth"
import { registerUser, confirmEmail, getAllUsers, deleteUserById, getUserById, loginUser, logoutUser } from "../controllers"
import { isAuthenticated } from "../middlewares"

export const authRoute = Router({
  caseSensitive: true,
  strict: true,
})

authRoute.get("/",isAuthenticated, getAllUsers)
authRoute.post(
  "/register",
  validateLoginUserData,
  registerUser
)
authRoute.get("/confirm-email/:token", confirmEmail) // post?
authRoute.post("/login", loginUser)
authRoute.patch("/verify-email/:accessToken")
authRoute.post("/logout", logoutUser)
authRoute.post("/refresh-token")
authRoute.get("/:userId", getUserById)
authRoute.post("/forgot-password")
authRoute.patch("/reset-password/:accessToken")
authRoute.delete("/:userId", deleteUserById)