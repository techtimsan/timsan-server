import { Router } from "express"

export const authRoute = Router({
  caseSensitive: true,
  strict: true,
})

authRoute.post("/register",)
authRoute.post("/login")
authRoute.patch("/verify-email/:accessToken")
authRoute.patch("/logout")
authRoute.post("/refresh-token")
authRoute.post("/forgot-password")
authRoute.patch("/reset-password/:accessToken")
