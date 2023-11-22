"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.updateProfilePic = exports.resetPassword = exports.deleteUserById = exports.getUserById = exports.getAllUsers = exports.refreshAccessToken = exports.logoutUser = exports.loginUser = exports.confirmEmail = exports.registerUser = void 0;
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
const db_1 = require("../lib/db");
const argon2_1 = __importDefault(require("argon2"));
const mail_1 = require("../lib/mail");
const constants_1 = require("../lib/constants");
const token_1 = require("../lib/token");
const redis_1 = require("../lib/redis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const upload_1 = require("../lib/upload");
const argon2_2 = __importDefault(require("argon2"));
exports.registerUser = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const emailExists = await db_1.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                email: true,
            },
        });
        if (emailExists)
            return next(new utils_1.ErrorHandler("User already exists", 400));
        const hashedPassword = await argon2_2.default.hash(password);
        // create new user
        const user = await db_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword
            }
        });
        const { firstName: firstname, lastName: lastname, email: emailAddress, emailVerified } = user;
        // generate email confirmation token
        const confirmationToken = (0, token_1.generateEmailConfirmationToken)({
            email: emailAddress,
            firstName: firstname,
            lastName: lastname,
        });
        const templateData = {
            firstName,
            emailConfirmationLink: `${constants_1.BASE_SERVER_URL}${constants_1.BASE_API_URL}/user/confirm-email/${confirmationToken}`,
        };
        // expires in 3 days
        const expiresAt = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
        // save new user to redis
        const redisUserData = await redis_1.redisStore.set(email, JSON.stringify({ firstName, lastName, email, emailVerified: false, token: confirmationToken, expiresAt }));
        // send activation email    
        const emailSuccess = await (0, mail_1.sendEmail)({
            emailAddress: email,
            subject: "Account Activation",
            template: "activation-mail.ejs",
            data: templateData,
        });
        res.status(201).json({
            success: true,
            message: `Check your mail to verify your email address`,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message,
        });
    }
});
exports.confirmEmail = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { token } = req.params;
        const verifiedToken = (0, token_1.verifyEmailConfirmationToken)(token);
        if (!verifiedToken)
            return res.status(401).json({
                message: "Invalid Token",
            });
        const { firstName, lastName, email } = verifiedToken;
        // email already verified
        const emailAlreadyVerified = await redis_1.redisStore.get(email);
        if (!emailAlreadyVerified) {
            const verifiedUser = await db_1.prisma.user.update({
                where: {
                    email
                },
                data: {
                    emailVerified: true
                }
            });
            res.status(200).json({
                message: "Email Address Verified 😎",
            });
        }
        res.status(400).json({
            status: "failed",
            message: "Email already verified"
        });
    }
    catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
});
exports.loginUser = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await db_1.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                password: true,
                email: true,
                emailVerified: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "Invalid Credentials! 😠",
            });
        }
        if (user && !user.emailVerified) {
            return res
                .status(401)
                .json({
                message: "Verify your email! ⚠",
            })
                .redirect("/user/login");
        }
        const isPassword = await argon2_1.default.verify(user.password, password);
        if (user && !isPassword) {
            return res.status(401).json({
                message: "Invalid Credentials! 😠",
            });
        }
        const { id, email: emailAddress, emailVerified, firstName, lastName, } = user;
        (0, token_1.sendAccessAndRefreshToken)({ id, firstName, lastName, email }, 200, res);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
// logout user
exports.logoutUser = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        // delete redis store value
        const userId = req.user?.id || "";
        await redis_1.redisStore.del(userId);
        res.status(200).json({
            success: true,
            message: "Logged out !",
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.refreshAccessToken = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshtoken;
        const decoded = (0, token_1.verifyAccessOrRefreshToken)(refreshToken, constants_1.refresh_token);
        const errorMessage = `Could not Refresh Token`;
        if (!decoded)
            return next(new utils_1.ErrorHandler(errorMessage, 400));
        const session = await redis_1.redisStore.get(decoded.user.id);
        if (!session)
            return next(new utils_1.ErrorHandler(errorMessage, 400));
        const user = JSON.parse(session);
        req.user = user;
        const accessToken = jsonwebtoken_1.default.sign(user, constants_1.access_token, {
            expiresIn: constants_1.access_token_expire,
        });
        const newRefreshToken = jsonwebtoken_1.default.sign(user, constants_1.refresh_token, {
            expiresIn: constants_1.refresh_token_expire,
        });
        res.cookie("access_token", accessToken, token_1.accessTokenOptions);
        res.cookie("refresh_token", newRefreshToken, token_1.refreshTokenOptions);
        res.status(200).json({
            success: true,
            accessToken,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.getAllUsers = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const users = await db_1.prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                conferences: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        res.status(200).json({
            message: "Fetched Users Successfully!",
            data: users,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.getUserById = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await db_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            res.status(404).json({
                message: "User does not exist!",
            });
        }
        const { password, ...userWithoutPassword } = user;
        res.status(200).json({
            message: "Fetched user successfully!",
            data: userWithoutPassword,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});
exports.deleteUserById = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await db_1.prisma.user.delete({
            where: {
                id: userId,
            },
        });
        res.status(200).json({
            message: "Deleted User Successfully!",
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});
exports.resetPassword = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { oldPassword, newPassword, } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return next(new utils_1.ErrorHandler("Not Authenticated", 400));
        }
        const user = await db_1.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user)
            return next(new utils_1.ErrorHandler("", 400));
        if (user.password === undefined || user.password === "") {
            return next(new utils_1.ErrorHandler("Invalid User", 400));
        }
        const isPasswordMatch = argon2_1.default.verify(oldPassword, user.password);
        if (!isPasswordMatch)
            return next(new utils_1.ErrorHandler("Invalid Credentials", 400));
        const updatedUser = await db_1.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: newPassword,
            },
        });
        await redis_1.redisStore.set(user.id, JSON.stringify(updatedUser));
        res.status(200).json({
            success: true,
            message: "Reset Password Successfully",
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
// update profile picture / avatar
exports.updateProfilePic = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { avatarUrl } = req.body;
        const userId = req.user?.id;
        if (!userId)
            return next(new utils_1.ErrorHandler("", 400));
        const avatar = await upload_1.cloudUpload.uploader.upload("", {
            folder: "avatars",
        });
        // TODO: Install Cloudinary / Cloud Provider
        const user = await db_1.prisma.memberProfile.update({
            where: {
                id: userId,
            },
            data: {
                avatarUrl: avatar.secure_url,
            },
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
// get user information
exports.getUserInfo = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        // const userId = req.user?.id
        // getUserById(userId, res, next)
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
