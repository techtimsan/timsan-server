import { User } from "@prisma/client"

declare global {
  namespace Express {
    interface Request {
      user?: User
      file?: FileUploadFormat
    }
  }
}

export interface FileUploadFormat {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  path: string;
}

export type SendActivationCodeMailOptions = {
  emailAddress: string
  subject: string
  template: string
  data: { [key: string]: any }
}

export type RegisterUserData = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type LoginUserData = {
  email: string
  password: string
}

export type ExcoProfileData = {
  firstName: string
  lastName: string
  otherNames?: string
  email: string
  phoneNumber: string
  avatarUrl: string
  courseOfStudy: string
  post: string
  occupation: string
  graduationStatus: "GRADUATE" | "UNDER_GRADUATE" | "POST_GRADUATE"
  graduationDate: Date
  stateOfOrigin: string
  stateOfResidence: string
}

export type AuthTokenOptions = {
  expires: Date
  maxAge: number
  httpOnly: boolean
  sameSite: "lax" | "strict" | "none" | undefined
  secure?: boolean
}

export type JWTSignOptions = {
  expiresIn?: string | number
}

export type MemberProfileData = {
  firstName: string
  lastName: string
  otherNames?: string
  bio: string
  phoneNumber: string
  email: string
  avatarUrl: string
  institution: string
  gender: "MALE" | "FEMALE"
  course: string
  occupation: string
  graduationStatus: "GRADUATE" | "UNDER_GRADUATE" | "POST_GRADUATE"
  graduationDate: Date
  stateOfOrigin: string
  stateOfResidence: string
}

export type ConferenceData = {
  title: string
  desc: string
  venue: string
  thumbnailUrl: string
  createdBy: string
  date: Date
}

export type ConferenceRegisterData = {
  emailAddress: string
  attendeeId: string
  membershipType: "TIMSANITE" | "IOTB" | "OTHERS"
  paymentStatus: "PAYMENT_SUCCESSFUL" | "PAYMENT_PENDING"
}

export type PostData = {
  title: string,
  desc: string,
  thumbnailUrl: string,
  author: string,
  // userLikeId: string,
  // userDislikeId: string,
  // userId: string,
}

export type BroadcastData = {
  title: string,
  desc: string,
  thumbnailUrl: string,
  author: string,

}