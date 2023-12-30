"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conferenceRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_1 = require("../lib/validate/auth");
exports.conferenceRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true,
});
exports.conferenceRoute.post("/create", (0, auth_1.validateData)(auth_1.CreateNewConferenceSchema), controllers_1.createNewConference);
exports.conferenceRoute.get("/", controllers_1.getAllConference);
/**
 * Register for Conference
 */
exports.conferenceRoute.post("/register/:conferenceId", (0, auth_1.validateData)(auth_1.CreateZoneProfileSchema), controllers_1.registerForConference);
/**
 * Get all Registered Attendees
 */
exports.conferenceRoute.get("/attendee", controllers_1.getAllConferenceAttendee);
exports.conferenceRoute.delete("/:conferenceId", controllers_1.deleteConferenceById);
