import express, { Express, Request, Response, NextFunction } from "express"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import { AUTH_ROUTE, CONFERENCE_ROUTE } from "./lib/constants"
import { authRoute, conferenceRoute } from "./routes"
import { ErrorHandler } from "./utils"

export const app: Express = express()

// // enable case-sensitivity for routes
app.set("case sensitive routing", true)

// // enable strict routing
app.set("strict routing", true)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.disable("x-powered-by")

// cors options
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   })
// )

// cookies
app.use(cookieParser())

app.use(morgan("dev"))

// error handler
// app.use(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     await rateLimiter.consume(req.ip)
//     next()
//   } catch (error: any) {
//     return res.status(429).json({
//       message: `Too many requests from ip: ${req.ip} . Try again later.`,
//     })
//   }
// })

// route endpoint
app.use(AUTH_ROUTE, authRoute)
app.use(CONFERENCE_ROUTE, conferenceRoute)

// healthcheck
// app.get("/", (req: Request, res: Response, next: NextFunction) => {
//   return next()
// })

// Catch 404 and forward to error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(400).json({
    message: "Invalid Request"
  })
})
