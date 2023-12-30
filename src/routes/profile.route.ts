import { Router } from "express";
import { addInstitution, getAllInstitutions } from "../controllers";
import { AddInstitutionProfileSchema, validateData } from "../lib/validate/auth";

export const profileRoute = Router({
    caseSensitive: true,
    strict: true
})

profileRoute.post("/institution", validateData(AddInstitutionProfileSchema), addInstitution)
profileRoute.get("/institution", getAllInstitutions)