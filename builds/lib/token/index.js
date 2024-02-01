"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailConfirmationToken = exports.generateEmailConfirmationToken = exports.sendAccessAndRefreshToken = exports.refreshTokenOptions = exports.accessTokenOptions = exports.verifyAccessOrRefreshToken = exports.signJWTAccessToken = exports.accessTokenMaxAge = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
exports.accessTokenMaxAge = 3 * 24 * 60 * 60;
const DEFAULT_JWT_SIGN_OPTION = {
    expiresIn: exports.accessTokenMaxAge,
};
const signJWTAccessToken = (payload, options = DEFAULT_JWT_SIGN_OPTION) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, constants_1.jwt_secret, options);
    return accessToken;
};
exports.signJWTAccessToken = signJWTAccessToken;
const verifyAccessOrRefreshToken = (token, secret) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
};
exports.verifyAccessOrRefreshToken = verifyAccessOrRefreshToken;
// cookie options
exports.accessTokenOptions = {
    expires: new Date(Date.now() + constants_1.access_token_expire * 60 * 60 * 1000),
    maxAge: constants_1.access_token_expire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + constants_1.refresh_token_expire * 24 * 60 * 60 * 1000),
    maxAge: constants_1.refresh_token_expire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true
};
// send access token on login
const sendAccessAndRefreshToken = (user, statusCode, res) => {
    const accessToken = jsonwebtoken_1.default.sign(user, constants_1.access_token, { expiresIn: "5m" });
    const refreshToken = jsonwebtoken_1.default.sign(user, constants_1.refresh_token, { expiresIn: "3d" });
    // upload session to redis
    //   redisStore.set(user.id, JSON.stringify(user) as any) TODO:
    // only set secure to `true` in prod
    if (process.env.NODE_ENV === "production")
        exports.accessTokenOptions.secure = true;
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
        message: "Logged in Successfully..."
    });
};
exports.sendAccessAndRefreshToken = sendAccessAndRefreshToken;
const generateEmailConfirmationToken = (userData) => {
    const confirmationToken = jsonwebtoken_1.default.sign(userData, constants_1.jwt_secret, { expiresIn: "3d" });
    return confirmationToken;
};
exports.generateEmailConfirmationToken = generateEmailConfirmationToken;
const verifyEmailConfirmationToken = (confirmationToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(confirmationToken, constants_1.jwt_secret);
        console.log("decoded jwt data : ", decoded);
        return decoded;
    }
    catch (error) {
        console.log("Error verifying email confirmation token : ", error);
        return null;
    }
};
exports.verifyEmailConfirmationToken = verifyEmailConfirmationToken;
