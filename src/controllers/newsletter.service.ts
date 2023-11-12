import { NextFunction, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";

export const subscribeToNewsletter = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error: any) {
        
    }
})