import { NextFunction, Request, Response } from "express"
import { asyncErrorMiddleware } from "../middlewares"
import { ConferenceData, ConferenceRegisterData } from "../types/app"
import { prisma } from "../lib/db"
import { sendEmail } from "../lib/mail"
import { ErrorHandler } from "../utils"

// admin middleware
export const createNewConference = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        title,
        venue,
        desc,
        date,
        createdBy,
        thumbnailUrl,
      }: ConferenceData = req.body

      const conferenceExists = await prisma.conference.findFirst({
        where: {
          title,
        },
      })

      if (conferenceExists) {
        return next(new ErrorHandler("Conference Already Exists", 400))
      }

      const conference = await prisma.conference.create({
        data: {
          title,
          venue,
          desc,
          date,
          thumbnailUrl,
          createdBy,
        },
      })

      res.status(201).json({
        message: "Created Conference Successfully",
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

export const getAllConference = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conferences = await prisma.conference.findMany()

      res.status(200).json({
        message: "Fetched Conferences Successfully!",
        data: conferences,
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

export const registerForConference = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        emailAddress,
        attendeeId,
        membershipType,
        paymentStatus,
      }: ConferenceRegisterData = req.body
      const { conferenceId } = req.params

      const conferenceExists = await prisma.conference.findFirst({
        where: {
          id: conferenceId,
        },
      })

      if (!conferenceExists)
        return next(new ErrorHandler("Conference does not Exist!", 400))

      const alreadyRegistered = await prisma.conferenceAttendee.findFirst({
        where: {
          attendeeId,
          conferenceId,
        },
      })

      if (alreadyRegistered)
        return next(new ErrorHandler("Already Registered for this Conference", 400))

      const newConferenceRegistration = await prisma.conferenceAttendee.create({
        data: {
          attendeeId,
          conferenceId,
          membershipType,
          paymentStatus,
        },
      })

      const attendeeDetails = await prisma.user.findFirst({
        where: {
          id: attendeeId
        }
      })
      const name = attendeeDetails?.firstName

      const conferenceMailData = { shortName: "ITAC", firstName: name }

      try {
        await sendEmail({
          emailAddress,
          subject: "Conference Registration",
          template: "conference-registration-mail.ejs",
          data: conferenceMailData,
        })

        res.status(200).json({
          success: true,
          message: "Conference Registration Successful! 📧 ",
          data: newConferenceRegistration,
        })
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

export const getAllConferenceAttendee = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attendees = await prisma.conferenceAttendee.findMany({
        select: {
          attendee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          paymentStatus: true,
          membershipType: true
        },
        orderBy: {
          attendee: {
            lastName: "asc"
          }
        }
      })

      res.status(200).json({
        message: "Fetched Conference Attendees Successfully! 😇 ",
        data: attendees,
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  }
)

export const deleteConferenceById = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conferenceId } = req.params
    
    const deletedConference = await prisma.conference.delete({
      where: {
        id: conferenceId
      }
    })

    res.status(200).json({
      success: true,
      message: "Deleted Conference Successfully!"
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})
