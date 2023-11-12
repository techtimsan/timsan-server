
import { Router } from "express"
import { validateRequestBody } from "zod-express-middleware"
import { createNewConference, deleteConferenceById, getAllConference, getAllConferenceAttendee, registerForConference } from "../controllers"

export const conferenceRoute = Router({
  caseSensitive: true,
  strict: true,
})

conferenceRoute.post("/create", createNewConference)
conferenceRoute.get("/", getAllConference)
/**
 * Register for Conference
 */
conferenceRoute.post("/register/:conferenceId", registerForConference)
/**
 * Get all Registered Attendees
 */
conferenceRoute.get("/attendee", getAllConferenceAttendee)
conferenceRoute.delete("/:conferenceId", deleteConferenceById)