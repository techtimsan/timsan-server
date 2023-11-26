import { NextFunction, Response, Router, Request } from "express"
import { validateRequestBody } from "zod-express-middleware"
import { CreateBroadCastSchema, CreateNewsSchema, validateData } from "../lib/validate/auth"
import { createNewsPost, deleteNewsPost, editNewsPost, getAllNewsPosts, getNewsPostById } from "../controllers"
import { isAuthenticated, uploadImage } from "../middlewares"


export const newsRoute = Router({
  caseSensitive: true,
  strict: true,
})

const tester = async (req: Request, res: Response, next: NextFunction) => {
  console.log("middleware working...")

  next()
}

newsRoute.get("/", getAllNewsPosts)
newsRoute.get("/:postId", getNewsPostById)
newsRoute.post("/createPost", isAuthenticated, uploadImage, validateData(CreateNewsSchema),  createNewsPost)
newsRoute.patch("/editPost/:postId", isAuthenticated, uploadImage, validateData(CreateNewsSchema), editNewsPost)
newsRoute.delete("/:postId", isAuthenticated, deleteNewsPost)

// newsRoute.post("/uploadTester", uploadImage, testingCloudUpload)
