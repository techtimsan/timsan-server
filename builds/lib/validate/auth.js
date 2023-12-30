"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = exports.TiletsCourseSchema = exports.AddNewBookELibrarySchema = exports.CreateZoneProfileSchema = exports.RegisterForConferenceSchema = exports.CreateNewConferenceSchema = exports.resendVerificationLinkSchema = exports.CreateBroadCastSchema = exports.CreateNewsSchema = exports.LoginUserSchema = exports.RegisterUserSchema = exports.ResetPasswordSchema = exports.formatZodError = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
// custom zod error formatter
const formatZodIssue = (issue) => {
    const { path, message } = issue;
    const pathString = path.join(".");
    return `${pathString}: ${message}`;
};
// Format the Zod error message with only the current error
const formatZodError = (error) => {
    const { issues } = error;
    if (issues.length) {
        const currentIssue = issues[0];
        return formatZodIssue(currentIssue);
    }
    return null;
};
exports.formatZodError = formatZodError;
exports.ResetPasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(6),
});
exports.RegisterUserSchema = zod_1.z.object({
    accountType: zod_1.z.enum(["MEMBER", "INSTITUTION", "STATE", "ZONAL", "NEC"]),
    firstName: zod_1.z.string().min(3),
    lastName: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.LoginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.CreateNewsSchema = zod_1.z.object({
    title: zod_1.z.string().min(5),
    desc: zod_1.z.string().min(5),
    author: zod_1.z.string().min(3),
    // userId: z.string().min(3),
    // userLikeId: z.string().min(0),
    // userDislikeId: z.string().min(0),
    // thumbnailUrl: z.string().min(6)
});
exports.CreateBroadCastSchema = zod_1.z.object({
    title: zod_1.z.string().min(5),
    desc: zod_1.z.string().min(5),
    author: zod_1.z.string().min(3),
    // thumbnailUrl: z.string().min(6)
});
exports.resendVerificationLinkSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.CreateNewConferenceSchema = zod_1.z.object({
    title: zod_1.z.string().min(5),
    venue: zod_1.z.string().min(5),
    desc: zod_1.z.string().min(5),
    date: zod_1.z.string().datetime(),
    createdBy: zod_1.z.string().min(3),
    thumbnailUrl: zod_1.z.string().min(5).url(),
});
exports.RegisterForConferenceSchema = zod_1.z.object({
    emailAddress: zod_1.z.string().email(),
    attendeeId: zod_1.z.string(),
    membershipType: zod_1.z.enum(["TIMSANITE", "IOTB", "OTHERS"]),
    paymentStatus: zod_1.z.enum(["PAYMENT_SUCCESSFUL", "PAYMENT_PENDING"]),
});
exports.CreateZoneProfileSchema = zod_1.z.object({});
exports.AddNewBookELibrarySchema = zod_1.z.object({
    category: zod_1.z.enum([
        "FAYDAH_BOOKS",
        "POETRY",
        "SEERAH",
        "HADITH",
        "FIQH",
        "PROJECTS_OR_MAGAZINES",
        "ARTICLES",
    ]),
    thumbnailUrl: zod_1.z.string(),
    rating: zod_1.z.number(),
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    desc: zod_1.z.string(),
});
exports.TiletsCourseSchema = zod_1.z.object({
    thumbnailUrl: zod_1.z.string(),
    title: zod_1.z.string(),
    date: zod_1.z.string(),
    level: zod_1.z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    rating: zod_1.z.number(),
    instructor: zod_1.z.string(),
});
const validateData = (schema) => async (req, res, next) => {
    try {
        schema.parse({
            ...req.body,
            ...req.params,
            ...req.query,
            ...req.file,
        });
        next();
    }
    catch (error) {
        // console.log(error)
        return next(new utils_1.ErrorHandler((0, exports.formatZodError)(error), 400));
    }
};
exports.validateData = validateData;
