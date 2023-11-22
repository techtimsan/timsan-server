"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTERNAL_REDIS_URL = exports.SMTP_PASSWORD = exports.SMTP_SERVICE = exports.SMTP_HOST = exports.SMTP_PORT = exports.SMTP_EMAIL = exports.course_cloud_upload_preset = exports.jwt_secret = exports.refresh_token_expire = exports.refresh_token = exports.access_token_expire = exports.access_token = exports.CONFERENCE_ROUTE = exports.AUTH_ROUTE = exports.BASE_API_URL = exports.BASE_SERVER_URL = exports.PORT = exports.CORS_ORIGIN = exports.envConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.envConfig = dotenv_1.default;
exports.CORS_ORIGIN = process.env.CORS_ORIGIN;
exports.PORT = Number(process.env.PORT || 3000);
exports.BASE_SERVER_URL = process.env.NODE_ENV === "production" ? process.env.BASE_SERVER_URL_PROD : process.env.BASE_SERVER_URL_DEV;
exports.BASE_API_URL = `/api/v1`;
exports.AUTH_ROUTE = `${exports.BASE_API_URL}/user`;
exports.CONFERENCE_ROUTE = `${exports.BASE_API_URL}/conference`;
exports.access_token = process.env.ACCESS_TOKEN;
exports.access_token_expire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
exports.refresh_token = process.env.REFRESH_TOKEN;
exports.refresh_token_expire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);
exports.jwt_secret = process.env.JWT_SECRET_KEY;
exports.course_cloud_upload_preset = `courses`;
// mail configs
exports.SMTP_EMAIL = process.env.SMTP_EMAIL;
exports.SMTP_PORT = Number(process.env.SMTP_PORT);
exports.SMTP_HOST = process.env.SMTP_HOST;
exports.SMTP_SERVICE = process.env.SMTP_SERVICE;
exports.SMTP_PASSWORD = process.env.SMTP_PASSWORD;
exports.EXTERNAL_REDIS_URL = process.env.EXTERNAL_REDIS_URL;
// export const INTERNAL_REDIS_URL = process.env.INTERNAL_REDIS_URL as string
