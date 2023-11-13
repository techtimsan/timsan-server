// import { NextFunction, Request, Response } from "express"
// import { asyncErrorMiddleware } from "../middlewares"
// import { MemberProfileData } from "../types/app"
// import { prisma } from "../lib/db"

// /**
//  * Member
//  */
// export const createMemberProfile = asyncErrorMiddleware(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const {
//         firstName,
//         lastName,
//         otherNames,
//         bio,
//         gender,
//         institution,
//         course,
//         occupation,
//         graduationStatus,
//         graduationDate,
//         stateOfOrigin,
//         stateOfResidence,
//         phoneNumber,
//         email,
//         avatarUrl,
//       }: MemberProfileData = req.body

//       const newMemberProfile = await prisma.memberProfile.create({
//         data: {
//           firstName,
//           lastName,
//           otherNames,
//           bio,
//           gender,
//           institution,
//           course,
//           occupation,
//           graduationStatus,
//           graduationDate,
//           stateOfOrigin,
//           stateOfResidence,
//           phoneNumber,
//           email,
//           avatarUrl,
//         },
//       })
//     } catch (error: any) {}
//   }
// )
