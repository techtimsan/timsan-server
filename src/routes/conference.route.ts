import { Router } from "express"

export const conferenceRoute = Router({
  caseSensitive: true,
  strict: true,
})

/**
 * Register for Conference
 */
conferenceRoute.post("/register")
/**
 * Get all Registered Attendees
 */
conferenceRoute.get("/attendees")