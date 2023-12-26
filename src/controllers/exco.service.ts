import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { ExcoProfileData } from "../types/app";
import { prisma } from "../lib/db";
import { ErrorHandler } from "../utils";

export const createExcoProfile = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { }: ExcoProfileData = req.body

        res.status(200).json({
            message: "Work on endpoint"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const getAllExcos = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const excos = await prisma.excoProfile.findMany()

        return res.status(200).json({
            message: "Fetched Excos Successfully! 😊",
            data: excos
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const getExcoByEmail = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            message: "work on endpoint"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const updateExcoProfile = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            message: "work on endpoint"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const deleteExcoProfile = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            message: "work on endpoint"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})