import { asyncErrorMiddleware } from "@/middlewares";
import { NextFunction, Request, Response } from "express";



export const registerUser = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {

})