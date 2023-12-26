import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { ErrorHandler } from "../utils";
import { prisma } from "../lib/db";

export type ELibraryBookProps = {
  category:
    | "FAYDAH_BOOKS"
    | "POETRY"
    | "SEERAH"
    | "HADITH"
    | "FIQH"
    | "PROJECTS_OR_MAGAZINES"
    | "ARTICLES";
  thumbnailUrl: string;
  rating: number;
  title: string;
  author: string;
  desc: string;
};

export const addNewBook = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        category,
        thumbnailUrl,
        rating,
        title,
        author,
        desc,
      }: ELibraryBookProps = req.body;

      const bookAlreadyExists = await prisma.book.findFirst({
        where: {
          title,
        },
      });

      if (bookAlreadyExists) {
        return next(new ErrorHandler("Book with Title Already Exists", 400))
      }

      const newBook = await prisma.book.create({
        data: {
          title,
          category,
          thumbnailUrl,
          rating,
          author,
          desc,
        },
      });

      res.status(201).json({
        message: "Book added to E-Library Successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllBooks = asyncErrorMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await prisma.book.findMany();

      res.status(200).json({
        message: "Fetched E-Library Books Successfully!",
        data: books,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
