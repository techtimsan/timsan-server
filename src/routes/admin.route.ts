import { Router } from "express"
import { isAdmin, isAuthenticated } from "../middlewares"

export const adminRoute = Router({
  caseSensitive: true,
  strict: true,
})

// news
adminRoute.post("/", isAuthenticated, isAdmin)
adminRoute.patch("/news/update/:newsId", isAuthenticated, isAdmin)
adminRoute.delete("/news/delete/:newsId", isAuthenticated, isAdmin)
// broadcasts
adminRoute.post("/broadcast/create", isAuthenticated, isAdmin)
adminRoute.patch("/broadcast/update/:broadcastId", isAuthenticated, isAdmin)
adminRoute.delete("/broadcast/delete/:broadcastId", isAuthenticated, isAdmin)
