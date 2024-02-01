"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBooks = exports.addNewBook = void 0;
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
const db_1 = require("../lib/db");
exports.addNewBook = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { category, thumbnailUrl, rating, title, author, desc, } = req.body;
        const bookAlreadyExists = await db_1.prisma.book.findFirst({
            where: {
                title,
            },
        });
        if (bookAlreadyExists) {
            return next(new utils_1.ErrorHandler("Book with Title Already Exists", 400));
        }
        const newBook = await db_1.prisma.book.create({
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
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.getAllBooks = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const books = await db_1.prisma.book.findMany();
        res.status(200).json({
            message: "Fetched E-Library Books Successfully!",
            data: books,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
