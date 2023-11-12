import { Router } from "express";
import { dbHealthCheck } from "../controllers/db.service";

export const dbRoute = Router()

dbRoute.post("/", dbHealthCheck)
