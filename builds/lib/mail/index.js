"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.mailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
const mailConfig = {
    service: constants_1.SMTP_SERVICE,
    host: constants_1.SMTP_HOST,
    port: constants_1.SMTP_PORT,
    auth: {
        user: constants_1.SMTP_EMAIL,
        pass: constants_1.SMTP_PASSWORD,
    },
};
exports.mailTransporter = nodemailer_1.default.createTransport(mailConfig);
// mailTransporter.verify
const sendEmail = async (options) => {
    const { emailAddress, subject, template, data } = options;
    const templatePath = path_1.default.join(__dirname, "../mail", template);
    const html = await ejs_1.default.renderFile(templatePath, data);
    const mailOptions = {
        from: constants_1.SMTP_EMAIL,
        to: emailAddress,
        subject,
        html
    };
    await exports.mailTransporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
