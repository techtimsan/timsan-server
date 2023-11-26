import { NextFunction, Request, Response } from "express"
import { asyncErrorMiddleware } from "../middlewares"
import { FileUploadFormat, InstitutionProfileData, MemberProfileData } from "../types/app"
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
    const userId = req.user?.id as string
    const email = req.user?.email as string
    try {

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
            newInstitutionProfile
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
      
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

export const getInstitutionProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
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
      
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

export const editStateProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', 500));
  }
  }
)

export const getStateProfile = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
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


