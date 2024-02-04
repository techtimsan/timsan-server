import { Router } from "express"

import {registerForTechFellowship} from '../controllers'
import { isAuthenticated } from "../middlewares"
import { RegisterFellowshipSchema, validateData } from "../lib/validate/auth"

export const iotbTechRoute = Router({
    caseSensitive: true,
    strict: true
})

iotbTechRoute.post("/register", validateData(RegisterFellowshipSchema), isAuthenticated,  registerForTechFellowship)