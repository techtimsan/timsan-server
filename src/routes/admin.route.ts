import { Router } from "express"

export const adminRoute = Router({
  caseSensitive: true,
  strict: true,
})

// news
adminRoute.post("/news/create",)
adminRoute.patch("/news/update/:newsId")
adminRoute.delete("/news/delete/:newsId")
// broadcasts
adminRoute.post("/broadcast/create")
adminRoute.patch("/broadcast/update/:broadcastId")
adminRoute.delete("/broadcast/delete/:broadcastId")
