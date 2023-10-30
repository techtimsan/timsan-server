import dotenv from "dotenv"
dotenv.config()

export const envConfig = dotenv

export const PORT = Number(process.env.PORT || 3000)

export const BASE_API_URL = `/api/v1`

export const USER_ROUTE = `${BASE_API_URL}/user`

export const access_token = process.env.ACCESS_TOKEN as string
export const access_token_expire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
)
export const refresh_token = process.env.REFRESH_TOKEN as string
export const refresh_token_expire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
)

export const jwt_secret = process.env.JWT_SECRET_KEY as string

export const course_cloud_upload_preset = `courses` as string
