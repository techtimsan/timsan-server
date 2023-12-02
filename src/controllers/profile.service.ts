import { NextFunction, Request, Response } from "express"
import { asyncErrorMiddleware } from "../middlewares"
import { FileUploadFormat, InstitutionProfileData, MemberProfileData, StateProfileData } from "../types/app"
import { prisma } from "../lib/db"
import { uploadToCloudinary } from "../lib/upload"
import { ErrorHandler } from "../utils"

/**
 * Member
 */
export const createMemberProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string
      const email = req.user?.email as string
      
      const {
        firstName,
        lastName,
        otherNames,
        bio,
        gender,
        institution,
        course,
        occupation,
        graduationStatus,
        graduationDate,
        stateOfOrigin,
        stateOfResidence,
        phoneNumber,
        institutionProfileId
      }: MemberProfileData = req.body
      
      
      let avatarUrl = ''
        if (req.file) {
            const file: FileUploadFormat = req.file;
            avatarUrl = await uploadToCloudinary(file, 'member-profile', userId);
        }

      const newMemberProfile = await prisma.memberProfile.create({
        data: {
          firstName,
          lastName,
          otherNames,
          bio,
          gender,
          institution,
          course,
          occupation,
          graduationStatus,
          graduationDate,
          stateOfOrigin,
          stateOfResidence,
          phoneNumber,
          email,
          avatarUrl,
          userId,
          institutionProfileId
        },
      })
      
      if (newMemberProfile) {
        res.status(200).json({
            success: true,
            message: 'Member Profile created successfully',
            data: newMemberProfile,
        });
      } else {
          return next(new ErrorHandler('Something went wrong creating profile', 500));
      }
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
})

export const editMemberProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string
      const email = req.user?.email as string
      
      const existingProfile = await prisma.memberProfile.findUnique({
        where: { id: userId },
      });
  
      if (!existingProfile) {
        return next(new ErrorHandler('Profile not found', 404));
      }
      const {
        firstName,
        lastName,
        otherNames,
        bio,
        gender,
        institution,
        course,
        occupation,
        graduationStatus,
        graduationDate,
        stateOfOrigin,
        stateOfResidence,
        phoneNumber,
        institutionProfileId
      }: MemberProfileData = req.body;

      let avatarUrl = existingProfile.avatarUrl;
      if (req.file) {
        const file: FileUploadFormat = req.file;
        avatarUrl = await uploadToCloudinary(file, 'member-profile', userId);
      }
      const updatedMemberProfile = await prisma.memberProfile.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          otherNames,
          bio,
          gender,
          institution,
          course,
          occupation,
          graduationStatus,
          graduationDate,
          stateOfOrigin,
          stateOfResidence,
          phoneNumber,
          email,
          institutionProfileId,
          avatarUrl
        },
      });
  
      res.status(200).json({
        success: true,
        message: 'Member Profile updated successfully',
        data: updatedMemberProfile,
      });

    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)


export const getMemberProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string
      const userProfile = await prisma.memberProfile.findUnique({
        where: { id: userId },
      });
  
      if (!userProfile) {
        return next(new ErrorHandler('Profile not found', 404));
      }
  
      res.status(200).json({
        success: true,
        message: 'Member Profile retrieved successfully',
        data: userProfile,
      });
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)


/**
 * Institution
 */

export const createInstitutionProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string
      const email = req.user?.email as string
      const {
        acronym,
        address,
        lat, 
        long, 
        state,
        zone,
        phoneNumber,
        stateProfileId,
        institutionName,
      }: InstitutionProfileData = req.body

      let avatarUrl = ''
      if (req.file) {
          const file: FileUploadFormat = req.file;
          avatarUrl = await uploadToCloudinary(file, 'institution-profile', userId);
      }

      const institutionExists = await prisma.institutionProfile.findFirst({
        where: { institutionName },
      });
  
      if (institutionExists) {
        return next(new ErrorHandler('Institution Profile Already Exists', 404));
      }
      
      const newInstitutionProfile = await prisma.institutionProfile.create({
        data:{
          acronym,
          address,
          lat, 
          long, 
          state,
          zone,
          email,
          phoneNumber,
          stateProfileId,
          institutionName,
          avatarUrl,
          userId
        }
      })
      if (newInstitutionProfile) {
        res.status(200).json({
            success: true,
            message: 'Institution Profile created successfully',
            data: newInstitutionProfile
          });
      } else {
          return next(new ErrorHandler('Something went wrong creating profile', 500));
      }

    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

export const editInstitutionProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string
      const email = req.user?.email as string


      const existingProfile = await prisma.institutionProfile.findFirst({
        where: { userId, email },
      });

      if (!existingProfile) {
        return next(new ErrorHandler('Institution Profile not found', 404));
      }
      const {
        acronym,
        address,
        lat, 
        long, 
        state,
        zone,
        phoneNumber,
        stateProfileId,
        institutionName: newInstitutionName,
      }: InstitutionProfileData = req.body

      const existingInstitution = await prisma.institutionProfile.findFirst({
        where: { institutionName: newInstitutionName },
        select: { institutionName: true },
      });
      
      const allInstitutions = await prisma.institutionProfile.findMany({
        select: { institutionName: true },
      });
      
      const existingNames = allInstitutions.map((inst) => inst.institutionName);
      
      if (existingInstitution || existingNames.includes(newInstitutionName)) {
        return next(new ErrorHandler('Institution name already exists', 400));
      }
      
      let avatarUrl = existingProfile.avatarUrl;
      if (req.file) {
        const file: FileUploadFormat = req.file;
        avatarUrl = await uploadToCloudinary(file, 'institution-profile', userId);
    }
      
      const updatedInstitutionProfile = await prisma.institutionProfile.update({
        where: { email, userId },
        data: {
          acronym,
            address,
            lat, 
            long, 
            state,
            zone,
            email,
            phoneNumber,
            stateProfileId,
            institutionName: newInstitutionName,
            avatarUrl,
            userId
        },
      });

      res.status(200).json({
        success: true,
        message: 'Institution Profile updated successfully',
        data: updatedInstitutionProfile,
      });

    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

export const getInstitutionProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string
      const InstitutionProfile = await prisma.institutionProfile.findFirst({
        where: { userId },
      });
  
      if (!InstitutionProfile) {
        return next(new ErrorHandler('Institution Profile not found', 404));
      }
  
      res.status(200).json({
        success: true,
        message: 'Institution Profile retrieved successfully',
        data: InstitutionProfile,
      });
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)



/**
 * State
 */

export const createStateProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string
      const email = req.user?.email as string
      const {
        address,
        state,
        zone,
        phoneNumber,
        zoneProfileId,
      }: StateProfileData = req.body

      let avatarUrl = ''
      if (req.file) {
          const file: FileUploadFormat = req.file;
          avatarUrl = await uploadToCloudinary(file, 'state-profile', userId);
      }

      const stateExists = await prisma.stateProfile.findFirst({
        where: { state },
      });
  
      if (stateExists) {
        return next(new ErrorHandler('State Profile Already Exists', 404));
      }
      
      const newStateProfile = await prisma.stateProfile.create({
        data:{
          address,
          state,
          zone,
          email,
          phoneNumber,
          avatarUrl,
          userId,
          zoneProfileId,
        }
      })
      if (newStateProfile) {
        res.status(200).json({
            success: true,
            message: 'State Profile created successfully',
            data: newStateProfile
          });
      } else {
          return next(new ErrorHandler('Something went wrong creating profile', 500));
      }
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

export const editStateProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string
      const email = req.user?.email as string


      const existingProfile = await prisma.stateProfile.findFirst({
        where: { userId, email },
      });

      if (!existingProfile) {
        return next(new ErrorHandler('State Profile not found', 404));
      }
      const {
        address,
        state: newState,
        zone,
        phoneNumber,
        zoneProfileId,
      }: StateProfileData = req.body

      const existingState = await prisma.stateProfile.findFirst({
        where: { state: newState },
        select: { state: true },
      });
      
      const allStates = await prisma.stateProfile.findMany({
        select: { state: true },
      });
      
      const existingStatesNames = allStates.map((st) => st.state);
      
      if (existingState || existingStatesNames.includes(newState)) {
        return next(new ErrorHandler('State name already exists', 400));
      }
      
      let avatarUrl = existingProfile.avatarUrl;
      if (req.file) {
        const file: FileUploadFormat = req.file;
        avatarUrl = await uploadToCloudinary(file, 'state-profile', userId);
      }
      
      const updatedStateProfile = await prisma.stateProfile.update({
        where: { email, userId },
        data: {
          address,
          state: newState,
          zone,
          email,
          phoneNumber,
          avatarUrl,
          userId,
          zoneProfileId,
        },
      });

      res.status(200).json({
        success: true,
        message: 'State Profile updated successfully',
        data: updatedStateProfile,
      });

      
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
    }
  }
)

export const getStateProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string
      const stateProfile = await prisma.stateProfile.findFirst({
        where: { userId },
      });
  
      if (!stateProfile) {
        return next(new ErrorHandler('State Profile not found', 404));
      }
  
      res.status(200).json({
        success: true,
        message: 'State Profile retrieved successfully',
        data: stateProfile,
      })

    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)


/**
 * Zone
 */

export const createZoneProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

export const editZoneProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

export const getZoneProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

/**
 * NEC
 */

export const createNECProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

export const editNECProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

export const getNECProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)


