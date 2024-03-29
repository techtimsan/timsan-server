import dotenv from "dotenv";
dotenv.config();

export const envConfig = dotenv;

export const CORS_ORIGIN = process.env.CORS_ORIGIN as string;

export const PORT = Number(process.env.PORT || 3001);

export const BASE_API_URL = `/api/v1`;

export const BASE_SERVER_URL =
  process.env.NODE_ENV === "production"
    ? (process.env.BASE_SERVER_URL_PROD as string)
    : `${process.env.BASE_SERVER_URL_DEV}${BASE_API_URL}`;


export const CLIENT_URL =
  process.env.NODE_ENV === "production" ? "https://timsan.com.ng" : "http://localhost:3000";

export const AUTH_ROUTE = `${BASE_API_URL}/user`;
export const CONFERENCE_ROUTE = `${BASE_API_URL}/conference`;
export const NEWS_ROUTE = `${BASE_API_URL}/news`;
export const BROADCAST_ROUTE = `${BASE_API_URL}/broadcast`;
export const REDIS_ROUTE = `${BASE_API_URL}/redis`;
export const NEWSLETTER_ROUTE = `${BASE_API_URL}/newsletter`;
export const PROFILE_ROUTE = `${BASE_API_URL}/profile`;
export const ELIBRARY_ROUTE = `${BASE_API_URL}/elibrary`;
export const TILETS_ROUTE = `${BASE_API_URL}/tilets`;
export const IOTB_ROUTE = `${BASE_API_URL}/iotbtech`;

export const access_token = process.env.ACCESS_TOKEN as string;
export const access_token_expire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "3000",
  10
);

export const refresh_token = process.env.REFRESH_TOKEN as string;
export const refresh_token_expire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

export const jwt_secret = process.env.JWT_SECRET_KEY as string;

export const course_cloud_upload_preset = `courses` as string;

// mail configs
export const SMTP_EMAIL = process.env.SMTP_EMAIL as string;
export const SMTP_PORT = Number(process.env.SMTP_PORT);
export const SMTP_HOST = process.env.SMTP_HOST as string;
export const SMTP_SERVICE = process.env.SMTP_SERVICE as string;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD as string;

export const EXTERNAL_REDIS_URL = process.env.EXTERNAL_REDIS_URL as string;
// export const EXTERNAL_DATABASE_URL = process.env.EXTERNAL_DATABASE_URL as string
// export const INTERNAL_REDIS_URL = process.env.INTERNAL_REDIS_URL as string

//CLOUDINARY
export const CLOUDINARY_CLOUD_NAME = process.env
  .CLOUDINARY_CLOUD_NAME as string;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string;
export const CLOUNDINAR_SECRET_KEY = process.env
  .CLOUNDINAR_SECRET_KEY as string;
