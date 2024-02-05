import { NextFunction, Response, Router, Request } from "express";
import { validateRequestBody } from "zod-express-middleware";
import {
  LoginUserSchema,
  RegisterUserSchema,
  RequestResetLink,
  ResetPasswordSchema,
  resendVerificationLinkSchema,
  validateData,
} from "../lib/validate/auth";
import {
  registerUser,
  getAllUsers,
  deleteUserById,
  getUserById,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  emailVerified,
  resendVerificationEmail,
  resetPassword,
  assignAdminOrSuperAdmin,
} from "../controllers";
import { isAdmin, isAuthenticated, isSuperAdmin } from "../middlewares";
// import {body, query, param, checkSchema} from 'express-validator'
import { z } from "zod";
import { requestPasswordReset } from "../controllers/auth.service";

export const authRoute = Router({
  caseSensitive: true,
  strict: true,
});

authRoute.get("/", isAuthenticated, getAllUsers);
authRoute.post("/register", validateData(RegisterUserSchema), registerUser);
authRoute.get("/verified", emailVerified);
authRoute.get("/verify-email/:userId/:confirmationToken", verifyEmail);
authRoute.post("/login", validateData(LoginUserSchema), loginUser);
authRoute.get("/logout", isAuthenticated, logoutUser);
authRoute.get("/refresh-token", refreshAccessToken); // TODO: isAuthenticated?
authRoute.get("/:userId", getUserById);
authRoute.patch(
  "/reset-password",
  validateData(ResetPasswordSchema),
  resetPassword
);
authRoute.post("/request-reset", validateData(RequestResetLink), requestPasswordReset); // sends a link

// forgot password
// authRoute.post("/forgot-password", forgotPassword);

authRoute.delete(
  "/:userId",
  validateData(
    z.object({
      userId: z.string(),
    })
  ),
  isAuthenticated,
  isSuperAdmin,
  deleteUserById
);
authRoute.post(
  "/resend-email",
  validateData(resendVerificationLinkSchema),
  // isAuthenticated,
  resendVerificationEmail
);
// assign admin
authRoute.patch("/admin", assignAdminOrSuperAdmin);

// email verification
