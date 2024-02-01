"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNewsletterSubscribers = exports.subscribeToNewsletter = void 0;
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
const db_1 = require("../lib/db");
exports.subscribeToNewsletter = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { email } = req.body;
        const alreadySubscribed = await db_1.prisma.newsletterSubscription.findFirst({
            where: {
                emailAddress: email,
            },
        });
        if (alreadySubscribed) {
            return next(new utils_1.ErrorHandler("Already Subscribed to Newsletter!", 400));
        }
        const newsletterSubscription = await db_1.prisma.newsletterSubscription.create({
            data: {
                emailAddress: email,
            },
        });
        res.status(201).json({
            message: "Thanks for Subscribing to our Newsletter!.",
            data: newsletterSubscription,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.getAllNewsletterSubscribers = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const subscribers = await db_1.prisma.newsletterSubscription.findMany({
            select: {
                emailAddress: true,
            },
            orderBy: {
                emailAddress: "asc",
            },
        });
        res.status(200).json({
            message: "Fetched Newsletter Subscribers Successfully!",
            data: subscribers,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
