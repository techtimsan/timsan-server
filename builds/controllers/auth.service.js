"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.getUserInfo = exports.updateProfilePic = exports.resetPassword = exports.deleteUserById = exports.getUserById = exports.getAllUsers = exports.refreshAccessToken = exports.logoutUser = exports.loginUser = exports.resendVerificationEmail = exports.emailVerified = exports.verifyEmail = exports.registerUser = void 0;
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
        const { firstName, lastName, email, password, accountType, } = req.body;
        switch (accountType) {
            case "MEMBER":
                const emailExists = await db_1.prisma.user.findUnique({
                    where: {
                        email,
                    },
                    select: {
                        email: true,
                    },
                });
                if (emailExists)
                    return next(new utils_1.ErrorHandler("Email already exists", 400));
                const hashedPassword = await argon2_2.default.hash(password);
                // create new user
                const user = await db_1.prisma.user.create({
                    data: {
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                    },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        emailVerified: true,
                    },
                });
                const { id: userId, firstName: firstname, lastName: lastname, email: emailAddress, emailVerified, } = user;
                // expires in 3 days
                const expiresAt = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
                // generate email confirmation token
                const confirmationToken = (0, token_1.generateEmailConfirmationToken)({
                    email: emailAddress,
                    firstName: firstname,
                    lastName: lastname,
                    emailVerified,
                });
                // save new user to redis
                const redisUserData = await redis_1.redisStore.set(userId, JSON.stringify({
                    userId,
                    id: userId,
                    firstName,
                    lastName,
                    email,
                    emailVerified,
                    token: confirmationToken,
                    expiresAt,
                }));
                const templateData = {
                    firstName,
                    emailConfirmationLink: `${constants_1.BASE_SERVER_URL}${constants_1.BASE_API_URL}/user/verify-email/${userId}/${confirmationToken}`,
                };
                // send activation email
                await (0, mail_1.sendEmail)({
                    emailAddress: email,
                    subject: "Account Activation",
                    template: "activation-mail.ejs",
                    data: templateData,
                });
                res.status(201).json({
                    success: true,
                    message: `Check your mail to verify your email address`,
                    result: redisUserData,
                    link: templateData.emailConfirmationLink,
                });
                break;
            default:
                next(new utils_1.ErrorHandler("Invalid account type provided.", 400));
                break;
        }
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.verifyEmail = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { userId, confirmationToken } = req.params;
        // check if email is in redis server
        const userExists = await redis_1.redisStore.get(userId);
        if (!userExists) {
            const errorMessage = "Email does not exist";
            res.redirect(`${constants_1.BASE_SERVER_URL}/api/v1/user/verified?error=true&message=${errorMessage}`);
        }
        // check if token is not expired
        const userData = JSON.parse(userExists);
        const expired = Date.now() >= userData.expiresAt;
        if (expired) {
            const errorMessage = "Confirmation Token already expired";
            res.redirect(`${constants_1.BASE_SERVER_URL}/api/v1/user/verified?error=true&message=${errorMessage}`);
        }
        const verifiedToken = (0, token_1.verifyEmailConfirmationToken)(confirmationToken);
        if (!verifiedToken) {
            const errorMessage = "Invalid Confirmation Token";
            res.redirect(`${constants_1.BASE_SERVER_URL}/api/v1/user/verified?error=true&message=${errorMessage}`);
        }
        if (verifiedToken && userData.emailVerified !== true) {
            const verifiedUser = await db_1.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    emailVerified: true,
                },
            });
            console.log("verified user : ", verifiedUser);
            // update redis data
            userData.emailVerified = verifiedUser.emailVerified;
            const verifiedUserData = JSON.stringify(userData);
            const updatedRedisUserData = await redis_1.redisStore.set(userId, verifiedUserData);
            const successMessage = "Email Verified Successfully";
            res.redirect(`${constants_1.BASE_SERVER_URL}/api/v1/user/verified?error=false&message=${successMessage}`);
        }
        else {
            const verifiedMessage = "Email Already Verified";
            res.redirect(`${constants_1.BASE_SERVER_URL}/api/v1/user/verified?error=true&message=${verifiedMessage}`);
        }
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.emailVerified = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { error, message } = req.query;
        const errorStatus = error === "true" ? true : false;
        res.render("email-verified", {
            error: errorStatus,
            message,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.resendVerificationEmail = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { email } = req.body;
        const isRegisteredUser = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (!isRegisteredUser) {
            return next(new utils_1.ErrorHandler("User does not exist!", 400));
        }
        const { id: userId, firstName, lastName, emailVerified, } = JSON.parse(JSON.stringify(isRegisteredUser));
        if (emailVerified)
            res.status(400).json({
                success: false,
                message: "Email Alredy Verified Successfully",
            });
        // generate email confirmation token
        const confirmationToken = (0, token_1.generateEmailConfirmationToken)({
            email: email,
            firstName,
            lastName,
            emailVerified,
        });
        const templateData = {
            firstName,
            emailConfirmationLink: `${constants_1.BASE_SERVER_URL}${constants_1.BASE_API_URL}/user/verify-email/${userId}/${confirmationToken}`,
        };
        // resend email
        await (0, mail_1.sendEmail)({
            emailAddress: email,
            subject: "Account Activation",
            template: "activation-mail.ejs",
            data: templateData,
        });
        // TODO:
        return res.status(200).json({
            message: "Verification Email has been re-sent."
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
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
            return next(new utils_1.ErrorHandler("Invalid Credentials! 😠", 400));
        }
        if (user && !user.emailVerified) {
            return next(new utils_1.ErrorHandler("Check your mail to verify your email address ⚠", 401));
            // .redirect("/user/login")
        }
        const isPassword = await argon2_1.default.verify(user.password, password);
        if (user && !isPassword) {
            return next(new utils_1.ErrorHandler("Invalid Credentials! 😠", 401));
        }
        const { id, email: emailAddress, emailVerified, firstName, lastName, } = user;
        (0, token_1.sendAccessAndRefreshToken)({ id, firstName, lastName, email }, 200, res);
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
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
        const session = await redis_1.redisStore.get(decoded.id);
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
                emailVerified: true,
                conferences: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: {
                lastName: "asc",
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
            select: {
                firstName: true,
                lastName: true,
                conferences: true,
                email: true,
                emailVerified: true,
                password: true,
                isAdmin: true,
                isSuperAdmin: true
            },
        });
        if (!user) {
            return next(new utils_1.ErrorHandler("User does not exist!", 400));
        }
        const { password, ...userWithoutPassword } = user;
        res.status(200).json({
            message: "Fetched user successfully!",
            data: userWithoutPassword,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
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
        // delete user redis data
        await redis_1.redisStore.del(userId);
        res.status(200).json({
            message: "Deleted User Successfully!",
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
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
            message: "Password Reset Successfully",
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
        res.status(200).json({
            message: "Updated Profile pic successfully"
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
        res.status(200).json({
            message: "Work on this endpoint..."
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.updateUserById = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { id, role, profileStatus, isAdmin, isSuperAdmin } = req.body;
        const userExists = await db_1.prisma.user.findUnique({
            where: {
                id
            }
        });
        if (!userExists)
            return next(new utils_1.ErrorHandler("Invalid credentials - Nonexistent", 400));
        const updatedUser = await db_1.prisma.user.update({
            where: {
                id
            },
            data: {
                isAdmin, isSuperAdmin
            }
        });
        res.status(200).json({
            message: "Updated User Successfully",
            data: updatedUser
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
