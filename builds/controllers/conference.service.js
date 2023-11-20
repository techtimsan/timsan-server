"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConferenceById = exports.getAllConferenceAttendee = exports.registerForConference = exports.getAllConference = exports.createNewConference = void 0;
const middlewares_1 = require("../middlewares");
const db_1 = require("../lib/db");
const mail_1 = require("../lib/mail");
// admin middleware
exports.createNewConference = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { title, venue, desc, date, createdBy, thumbnailUrl, } = req.body;
        const conferenceExists = await db_1.prisma.conference.findFirst({
            where: {
                title,
            },
        });
        if (conferenceExists) {
            return res.status(400).json({
                message: "Conference Already Exists",
            });
        }
        const conference = await db_1.prisma.conference.create({
            data: {
                title,
                venue,
                desc,
                date,
                thumbnailUrl,
                createdBy,
            },
        });
        res.status(201).json({
            message: "Created Conference Successfully",
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
});
exports.getAllConference = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const conferences = await db_1.prisma.conference.findMany();
        res.status(200).json({
            message: "Fetched Conferences Successfully!",
            data: conferences,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
});
exports.registerForConference = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { emailAddress, attendeeId, membershipType, paymentStatus, } = req.body;
        const { conferenceId } = req.params;
        const conferenceExists = await db_1.prisma.conference.findFirst({
            where: {
                id: conferenceId,
            },
        });
        if (!conferenceExists)
            return res.status(404).json({
                message: "Conference does not Exist!",
            });
        const alreadyRegistered = await db_1.prisma.conferenceAttendee.findFirst({
            where: {
                attendeeId,
                conferenceId,
            },
        });
        if (alreadyRegistered)
            res.status(400).json({
                message: "Already Registered for this Conference",
            });
        const newConferenceRegistration = await db_1.prisma.conferenceAttendee.create({
            data: {
                attendeeId,
                conferenceId,
                membershipType,
                paymentStatus,
            },
        });
        const conferenceMailData = { shortName: "ITAC", firstName: "Ridwan" };
        try {
            await (0, mail_1.sendEmail)({
                emailAddress,
                subject: "Conference Registration",
                template: "conference-registration-mail.ejs",
                data: conferenceMailData,
            });
            res.status(200).json({
                success: true,
                message: "Conference Registration Successful! 📧 ",
                data: newConferenceRegistration,
            });
        }
        catch (error) {
            res.status(400).json({
                error: error.message,
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
});
exports.getAllConferenceAttendee = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const attendees = await db_1.prisma.conferenceAttendee.findMany();
        res.status(200).json({
            message: "Fetched Conference Attendees Successfully! 😇 ",
            data: attendees,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});
exports.deleteConferenceById = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { conferenceId } = req.params;
        const deletedConference = await db_1.prisma.conference.delete({
            where: {
                id: conferenceId
            }
        });
        res.status(200).json({
            success: true,
            message: "Deleted Conference Successfully!"
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
