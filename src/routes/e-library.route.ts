import { Router } from "express";
import { addNewBook, getAllBooks } from "../controllers";
import { AddNewBookELibrarySchema, validateData } from "../lib/validate/auth";

export const eLibraryRoute = Router({
  caseSensitive: true,
  strict: true,
});

eLibraryRoute.post("/", validateData(AddNewBookELibrarySchema), addNewBook);
eLibraryRoute.get("/", getAllBooks);
