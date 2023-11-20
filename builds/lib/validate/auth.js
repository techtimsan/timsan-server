"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginUserData = exports.LoginUserSchema = exports.validateRegisterUserData = exports.RegisterUserSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.RegisterUserSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .refine((data) => data.trim() !== "", "Enter a Valid FirstName"),
    lastName: zod_1.z.string().min(3, "Enter a Valid LastName"),
    email: zod_1.z.string().email({ message: "Invalid Email Address" }),
});
const validateRegisterUserData = (schema) => (req, res, next) => {
    try {
        schema.parse({
            ...req.body,
        });
        next();
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: error,
        });
    }
};
exports.validateRegisterUserData = validateRegisterUserData;
exports.LoginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const validateLoginUserData = (schema) => (req, res, next) => {
    try {
        schema.parse({
            ...req.body,
        });
        next();
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
};
exports.validateLoginUserData = validateLoginUserData;
