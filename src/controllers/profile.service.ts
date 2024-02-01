import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { prisma } from "../lib/db";
import { ErrorHandler } from "../utils";
import {
  ExcoProfileData,
  InstitutionProfileData,
  NecProfileData,
  PatronProfileData,
  StateProfileData,
  ZoneProfileData,
} from "../types/app";

// nec profile
export const createNecProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const user = req.user;

      // if (!user) return next(new ErrorHandler("Unauthenticated", 400));

      // const userId = user.id;

      const { address, email, phoneNumber, avatarUrl }: NecProfileData =
        req.body;

      const profileExists = await prisma.necProfile.findFirst({
        where: {
          email,
        },
      });

      if (profileExists)
        return next(
          new ErrorHandler("Nec Profile Account already exists", 400)
        );

      const necProfile = await prisma.necProfile.create({
        data: {
          address,
          email,
          phoneNumber,
          avatarUrl,
          userId: "clrhw7u0i0000mm54lzpz4xah",
        },
      });

      res.status(201).json({
        message: "Created Nec Profile Successfully",
        data: necProfile,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getNecProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req user: ", req.user);
      const necProfiles = await prisma.necProfile.findMany();

      res.status(200).json({
        message: "Fetched Nec Profiles Successfully!",
        data: necProfiles,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createZoneProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const user = req.user;

      // if (!user) return next(new ErrorHandler("Unauthenticated", 400));

      // const userId = user.id;

      const { address, email, phoneNumber, zone, avatarUrl }: ZoneProfileData =
        req.body;

      const profileExists = await prisma.zoneProfile.findFirst({
        where: {
          email,
        },
      });

      if (profileExists)
        return next(
          new ErrorHandler("Zone Profile Account already exists", 400)
        );

      const zoneProfile = await prisma.zoneProfile.create({
        data: {
          zone,
          address,
          email,
          phoneNumber,
          avatarUrl,
          userId: "clrhw7u0i0000mm54lzpz4xah",
        },
      });

      res.status(201).json({
        message: "Created Zone Profile Successfully",
        data: zoneProfile,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllZoneProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const zoneProfiles = await prisma.zoneProfile.findMany({});

      res.status(200).json({
        message: "Fetched Zone Profiles successfully!",
        data: zoneProfiles,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createStateProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const user = req.user;

      // if (!user) return next(new ErrorHandler("Unauthenticated", 400));

      // const userId = user.id;

      const {
        address,
        email,
        phoneNumber,
        zone,
        avatarUrl,
        state,
        zoneProfileId,
      }: StateProfileData = req.body;

      const profileExists = await prisma.stateProfile.findFirst({
        where: {
          email,
        },
      });

      if (profileExists)
        return next(
          new ErrorHandler("State Profile Account already exists", 400)
        );

      const stateProfile = await prisma.stateProfile.create({
        data: {
          state,
          zoneProfileId,
          zone,
          address,
          email,
          phoneNumber,
          avatarUrl,
          userId: "clrhw7u0i0000mm54lzpz4xah",
        },
      });

      res.status(201).json({
        message: "Created State Profile Successfully",
        data: stateProfile,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getStateProfiles = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stateProfiles = await prisma.stateProfile.findMany({});

      res.status(200).json({
        message: "Fetched State Profiles Successfully!",
        data: stateProfiles,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createExcoProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const user = req.user;

      // if (!user) return next(new ErrorHandler("Unauthenticated", 400));

      // const userId = user.id;

      const {
        avatarUrl,
        courseOfStudy,
        email,
        firstName,
        graduationDate,
        graduationStatus,
        lastName,
        occupation,
        phoneNumber,
        post,
        stateOfOrigin,
        stateOfResidence,
        otherNames,
      }: ExcoProfileData = req.body;

      const profileExists = await prisma.excoProfile.findFirst({
        where: {
          email,
        },
      });

      if (profileExists)
        return next(
          new ErrorHandler("Exco Profile Account already exists", 400)
        );

      const excoProfile = await prisma.excoProfile.create({
        data: {
          courseOfStudy,
          firstName,
          graduationDate,
          graduationStatus,
          lastName,
          occupation,
          post,
          stateOfOrigin,
          stateOfResidence,
          otherNames,
          email,
          phoneNumber,
          avatarUrl,
          eventId: "",
          institutionId: "",
          necProfileId: "",
          stateProfileId: "",
          zoneProfileId: "",
        },
      });

      res.status(201).json({
        message: "Created Exco Profile Successfully",
        data: excoProfile,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getExcoProfiles = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const excoProfiles = await prisma.excoProfile.findMany({});

      res.status(200).json({
        message: "Fetched Exco Profiles Successfully!",
        data: excoProfiles,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createPatronProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        email,
        phoneNumber,
        avatarUrl,
        zoneProfileId,
        firstName,
        institutionId,
        lastName,
        necProfileId,
        occupation,
        otherNames,
        placeOfWork,
        post,
        stateOfResidence,
        stateProfileId,
        title,
      }: PatronProfileData = req.body;

      const profileExists = await prisma.patronProfile.findFirst({
        where: {
          email,
        },
      });

      if (profileExists)
        return next(
          new ErrorHandler("State Profile Account already exists", 400)
        );

      const patronProfile = await prisma.patronProfile.create({
        data: {
          zoneProfileId,
          firstName,
          institutionId,
          lastName,
          necProfileId,
          occupation,
          otherNames,
          placeOfWork,
          post,
          stateOfResidence,
          stateProfileId,
          title,
          email,
          phoneNumber,
          avatarUrl,
        },
      });

      res.status(201).json({
        message: "Created State Profile Successfully",
        data: patronProfile,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getPatronProfiles = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patronProfiles = await prisma.patronProfile.findMany({});

      res.status(200).json({
        message: "Fetched Patron Profiles Successfully!",
        data: patronProfiles,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const addInstitution = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        institutionName,
        zone,
        acronym,
        address,
        lat,
        long,
        email,
        state,
        phoneNumber,
      }: InstitutionProfileData = req.body;

      const alreadyExists = await prisma.institutionProfile.findFirst({
        where: {
          institutionName,
        },
      });

      if (alreadyExists) {
        return next(new ErrorHandler("Institution Already Exists!", 400));
      }

      const institution = await prisma.institutionProfile.create({
        data: {
          institutionName,
          acronym,
          address,
          lat,
          long,
          zone,
          email,
          state,
          phoneNumber,
          stateProfileId: "",
          userId: "",
        },
      });

      res.status(200).json({
        message: "Institution Added Successfully!",
        data: institution,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllInstitutions = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const institutions = await prisma.institutionProfile.findMany({
        select: {
          institutionName: true,
          lat: true,
          long: true,
        },
      });

      res.status(200).json({
        message: "Fetched Institutions Successfully!",
        data: institutions,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllExcos = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const excos = await prisma.excoProfile.findMany();

      return res.status(200).json({
        message: "Fetched Excos Successfully! 😊",
        data: excos,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getExcoByEmail = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        message: "work on endpoint",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateExcoProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        message: "work on endpoint",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const deleteExcoProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        message: "work on endpoint",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
