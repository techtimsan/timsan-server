import { Router } from "express";
import {
  addInstitution,
  createExcoProfile,
  createNecProfile,
  createPatronProfile,
  createStateProfile,
  createZoneProfile,
  deleteExcoProfile,
  getAllExcos,
  getAllInstitutions,
  getAllZoneProfile,
  getExcoByEmail,
  getExcoProfiles,
  getNecProfile,
  getStateProfiles,
  updateExcoProfile,
} from "../controllers";
import {
  AddInstitutionProfileSchema,
  CreateExcoProfileSchema,
  CreateNecProfileSchema,
  CreateStateProfileSchema,
  CreateZoneProfileSchema,
  validateData,
} from "../lib/validate/auth";
import { isAuthenticated } from "../middlewares";

export const profileRoute = Router({
  caseSensitive: true,
  strict: true,
});

profileRoute.get("/institution", isAuthenticated, getAllInstitutions);
profileRoute.post(
  "/institution",
  validateData(AddInstitutionProfileSchema), isAuthenticated,
  addInstitution
);
profileRoute.post(
  "/nec",
  validateData(CreateNecProfileSchema),
  isAuthenticated,
  createNecProfile
);
profileRoute.get("/nec", isAuthenticated, getNecProfile);
profileRoute.post(
  "/zone",
  validateData(CreateZoneProfileSchema), isAuthenticated,
  createZoneProfile
);
profileRoute.get("/zone", isAuthenticated, getAllZoneProfile);
profileRoute.post(
  "/state",
  validateData(CreateStateProfileSchema),
  isAuthenticated,
  createStateProfile
);
profileRoute.get("/state", isAuthenticated, getStateProfiles);
profileRoute.post(
  "/exco",
  validateData(CreateExcoProfileSchema),
  isAuthenticated,
  createExcoProfile
);
profileRoute.get("/exco", isAuthenticated, getExcoProfiles);
profileRoute.delete("/exco/:id", isAuthenticated, deleteExcoProfile);
profileRoute.get("/exco", isAuthenticated, getAllExcos);
profileRoute.get("/exco/:emali", isAuthenticated, getExcoByEmail);
profileRoute.patch("/exco/:id", isAuthenticated, updateExcoProfile);
profileRoute.post("/patron", isAuthenticated, createPatronProfile);
