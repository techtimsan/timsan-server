import { NextFunction, Response, Router, Request } from "express"
import { validateRequestBody } from "zod-express-middleware"
import { CreateBroadCastSchema, CreateNewsSchema, validateData } from "../lib/validate/auth"
import { createBroadcast, editBroadcast, getAllBroadcasts, getBroadcastById, deleteBroadcast } from "../controllers"
import { uploadImage } from "../middlewares"


export const broadcastRoute = Router({
  caseSensitive: true,
  strict: true,
})

const tester = async (req: Request, res: Response, next: NextFunction) => {
  console.log("middleware working...")

  next()
}

broadcastRoute.get("/", getAllBroadcasts)
broadcastRoute.get("/:broadcastId", getBroadcastById)
broadcastRoute.post("/createBroadcast", uploadImage, validateData(CreateBroadCastSchema),  createBroadcast)
broadcastRoute.patch("/editBroadcast/:broadcastId", uploadImage, validateData(CreateBroadCastSchema), editBroadcast)
broadcastRoute.delete("/:broadcastId", deleteBroadcast)
// test commit update
broadcastRoute.put("/test")
