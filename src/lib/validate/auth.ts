import { NextFunction, Request, Response } from "express"
import { Schema, z } from "zod"

export const RegisterUserSchema = z.object({
  firstName: z.string().refine((data) => data.trim() !== "", "Enter a Valid FirstName"),
  lastName: z.string().min(3, "Enter a Valid LastName"),
  email: z.string().email({ message: "Invalid Email Address" }),
})

export const validateRegisterUserData =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        ...req.body,
      })

      next()
    } catch (error: any) {
      console.log(error)
      res.status(400).json({
        message: error,
      })
    }
  }
