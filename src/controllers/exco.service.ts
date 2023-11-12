import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { ExcoProfileData } from "../types/app";
import { prisma } from "../lib/db";

export const createExcoProfile = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { }: ExcoProfileData = req.body
    } catch (error: any) {
        
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
        
    }
})

export const getExcoByEmail = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error: any) {
        
    }
})

export const updateExcoProfile = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error: any) {
        
    }
})

export const deleteExcoProfile = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error: any) {
        
    }
})