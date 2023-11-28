import { Router } from "express"
import { validateRequestBody } from "zod-express-middleware"
import {
  createNewConference,
  deleteConferenceById,
  getAllConference,
  getAllConferenceAttendee,
  registerForConference,
} from "../controllers"
import { CreateNewConferenceSchema, RegisterForConferenceSchema, validateData } from "../lib/validate/auth"

export const conferenceRoute = Router({
  caseSensitive: true,
  strict: true,
})

conferenceRoute.post("/create", validateData(CreateNewConferenceSchema), createNewConference)
conferenceRoute.get("/", getAllConference)
/**
 * Register for Conference
 */
conferenceRoute.post("/register/:conferenceId", validateData(RegisterForConferenceSchema), registerForConference)
/**
 * Get all Registered Attendees
 */
conferenceRoute.get("/attendee", getAllConferenceAttendee)
conferenceRoute.delete("/:conferenceId", deleteConferenceById)
