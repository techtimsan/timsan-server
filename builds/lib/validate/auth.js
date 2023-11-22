"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = exports.LoginUserSchema = exports.RegisterUserSchema = exports.formatZodError = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
// custom zod error formatter
const formatZodIssue = (issue) => {
    const { path, message } = issue;
    const pathString = path.join('.');
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
exports.RegisterUserSchema = zod_1.z.object({
    firstName: zod_1.z
        .string().min(3),
    lastName: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
exports.LoginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const validateData = (schema) => async (req, res, next) => {
    try {
        schema.parse({
            ...req.body,
            ...req.params,
            ...req.query
        });
        next();
    }
    catch (error) {
        // console.log(error)
        return next(new utils_1.ErrorHandler((0, exports.formatZodError)(error), 400));
    }
};
exports.validateData = validateData;
