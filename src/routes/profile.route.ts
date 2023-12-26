import { Router } from "express";
import { getAllInstitutions } from "../controllers";

export const profileRoute = Router({
    caseSensitive: true,
    strict: true
})

profileRoute.get("/institution", getAllInstitutions)