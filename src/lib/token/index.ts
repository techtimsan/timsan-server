import jwt, { JwtPayload } from "jsonwebtoken"
import {
  access_token,
  access_token_expire,
  jwt_secret,
  refresh_token,
  refresh_token_expire,
} from "../constants"
import { Response } from "express"
import { AuthTokenOptions, JWTSignOptions } from "../../types/app"

export const accessTokenMaxAge = 3 * 24 * 60 * 60

const DEFAULT_JWT_SIGN_OPTION: JWTSignOptions = {
  expiresIn: accessTokenMaxAge,
}

export const signJWTAccessToken = (
  payload: JwtPayload,
  options: JWTSignOptions = DEFAULT_JWT_SIGN_OPTION
) => {
  const accessToken = jwt.sign(payload, jwt_secret, options)

  return accessToken
}

export const verifyAccessOrRefreshToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret)

    return decoded as {
      user: { id: string; name: string; email: string }
    }
  } catch (error) {
    console.log("Error verifying jwt : ", error)
    return null
  }
}

// cookie options
export const accessTokenOptions: AuthTokenOptions = {
  expires: new Date(Date.now() + access_token_expire * 60 * 60 * 1000),
  maxAge: access_token_expire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
}

export const refreshTokenOptions: AuthTokenOptions = {
  expires: new Date(Date.now() + refresh_token_expire * 24 * 60 * 60 * 1000),
  maxAge: refresh_token_expire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
}

// send access token on login
export const sendAccessAndRefreshToken = (
  user: { id: string; firstName: string; lastName: string, email: string },
  statusCode: number,
  res: Response
) => {
  const accessToken = jwt.sign(user, access_token, { expiresIn: "5m" })
  const refreshToken = jwt.sign(user, refresh_token, { expiresIn: "3d" })

  // upload session to redis
  //   redisStore.set(user.id, JSON.stringify(user) as any) TODO:

  // only set secure to `true` in prod
  if (process.env.NODE_ENV === "production") accessTokenOptions.secure = true

  res.cookie("access_token", accessToken, accessTokenOptions)
  res.cookie("refresh_token", refreshToken, refreshTokenOptions)

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  })
}

export const generateEmailConfirmationToken = (userData: {
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean
}) => {
  const confirmationToken = jwt.sign(userData, jwt_secret, { expiresIn: "3d" })

  return confirmationToken
}

export const verifyEmailConfirmationToken = (confirmationToken: string) => {
  try {
    const decoded = jwt.verify(confirmationToken, jwt_secret)

    console.log("decoded jwt data : ", decoded)

    return decoded as {
      firstName: string
      email: string
      lastName: string
      emailVerified: boolean
      iat: number
      exp: number
    }
  } catch (error) {
    console.log("Error verifying email confirmation token : ", error)
    return null
  }
}
