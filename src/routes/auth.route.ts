import { Router } from "express"
import { validateRequestBody } from "zod-express-middleware"
import { RegisterUserSchema, validateRegisterUserData } from "../lib/validate/auth"
import { registerUser, confirmEmail, getAllUsers, deleteUserById } from "../controllers"

export const authRoute = Router({
  caseSensitive: true,
  strict: true,
})

authRoute.get("/", getAllUsers)
authRoute.post(
  "/register",
  registerUser
)
authRoute.get("/confirm-email/:token", confirmEmail) // post?
authRoute.post("/login")
authRoute.patch("/verify-email/:accessToken")
authRoute.post("/logout")
authRoute.post("/refresh-token")
authRoute.post("/forgot-password")
authRoute.patch("/reset-password/:accessToken")
authRoute.delete("/:userId", deleteUserById)