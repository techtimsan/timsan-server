// import { NextFunction, Response, Router, Request } from "express"
// import { 
//   createNECProfile,
//   editNECProfile,
//   getNECProfile,

//   createZoneProfile,
//   editZoneProfile,
//   getZoneProfile,
  
//   createStateProfile,
//   editStateProfile,
//   getStateProfile,
  
//   createInstitutionProfile,
//   editInstitutionProfile,
//   getInstitutionProfile,
  
//   createMemberProfile,
//   editMemberProfile,
//   getMemberProfile

//      } from "../controllers"
// import { isAuthenticated, validateFields } from "../middlewares"
// import { CreateZoneProfileSchema, validateData } from "../lib/validate/auth"
// // import {body, query, param, checkSchema} from 'express-validator'


// export const profileRoute = Router({
//   caseSensitive: true,
//   strict: true,
// })

// const tester = async (req: Request, res: Response, next: NextFunction) => {
//   console.log("middleware working...")

//   next()
// }

// profileRoute.post("/zone/create", isAuthenticated, validateData(CreateZoneProfileSchema), createZoneProfile)
// profileRoute.patch("/zone/edit", isAuthenticated, validateData(CreateZoneProfileSchema), editZoneProfile)
// profileRoute.get("/zone", isAuthenticated, getZoneProfile)

