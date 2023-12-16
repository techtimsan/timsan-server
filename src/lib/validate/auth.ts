import { NextFunction, Request, Response } from "express"
import { Schema, z } from "zod"
import { ErrorHandler } from "../../utils"
import { ZodIssue, ZodError } from "zod"

// custom zod error formatter
const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue
  const pathString = path.join(".")

  return `${pathString}: ${message}`
}

// Format the Zod error message with only the current error
export const formatZodError = (error: ZodError) => {
  const { issues } = error

  if (issues.length) {
    const currentIssue = issues[0]

    return formatZodIssue(currentIssue)
  }

  return null
}

export const RegisterUserSchema = z.object({
  accountType: z.enum(["MEMBER", "INSTITUTION", "STATE", "ZONAL", "NEC"]),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const CreateNewsSchema = z.object({
  title: z.string().min(5),
  desc: z.string().min(5),
  author: z.string().min(3),
  // userId: z.string().min(3),
  // userLikeId: z.string().min(0),
  // userDislikeId: z.string().min(0),
  // thumbnailUrl: z.string().min(6)
})

export const CreateBroadCastSchema = z.object({
  title: z.string().min(5),
  desc: z.string().min(5),
  author: z.string().min(3),
  // thumbnailUrl: z.string().min(6)
})

export const resendVerificationLinkSchema = z.object({
  email: z.string().email(),
})

export const CreateNewConferenceSchema = z.object({
  title: z.string().min(5),
  venue: z.string().min(5),
  desc: z.string().min(5),
  date: z.string().datetime(),
  createdBy: z.string().min(3),
  thumbnailUrl: z.string().min(5).url(),
})

export const RegisterForConferenceSchema = z.object({
  emailAddress: z.string().email(),
  attendeeId: z.string(),
  membershipType: z.enum(["TIMSANITE", "IOTB", "OTHERS"]),
  paymentStatus: z.enum(["PAYMENT_SUCCESSFUL", "PAYMENT_PENDING"]),
})

export const CreateZoneProfileSchema = z.object({
  zone: z.enum(["SOUTH_WEST", "NORTH_WEST", "NORTH_CENTRAL", "NORTH_EAST"]),
  address: z.string().min(5),
  email: z.string().email(),
  phone: z.string().min(10),
  avatarUrl: z.string()
})

export const CreateStateProfileSchema = z.object({
  zone: z.enum(["SOUTH_WEST", "NORTH_WEST", "NORTH_CENTRAL", "NORTH_EAST"]),
  address: z.string().min(5),
  email: z.string().email(),
  phone: z.string().min(10),
  avatarUrl: z.string()
})


export const validateData =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        ...req.body,
        ...req.params,
        ...req.query,
        ...req.file,
      })

      next()
    } catch (error: any) {
      // console.log(error)
      return next(new ErrorHandler(formatZodError(error) as string, 400))
    }
  }
