import express, { Express, Request, Response, NextFunction } from "express"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import { AUTH_ROUTE, CONFERENCE_ROUTE, NEWS_ROUTE } from "./lib/constants"
import { authRoute, conferenceRoute, newsRoute } from "./routes"
import path from "path"
import { ErrorHandler } from "./utils"
import { errorMiddleware } from "./middlewares"

export const app: Express = express()

// // enable case-sensitivity for routes
app.set("case sensitive routing", true)

// // enable strict routing
app.set("strict routing", true)

// app.use(express.json())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: false }))

app.disable("x-powered-by")

// cors options
app.use(
  cors({
    origin: "*", // CORS_ORIGIN
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
)

// cookies
app.use(cookieParser())

app.use(morgan("dev"))

// Set the view engine to EJS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/lib/mail"))

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

// error handler middleware
app.use(errorMiddleware)
// healthcheck
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    message: "Welcome! I hope you're Authorized to be here!!!",
  })
})

// route endpoint
app.use(AUTH_ROUTE, authRoute)
app.use(CONFERENCE_ROUTE, conferenceRoute)
app.use(NEWS_ROUTE, newsRoute)
// app.use(BROADCAST_ROUTE, broadcastRoute)

// Catch 404 and forward to error handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(
    `${req.method} - ${req.url.split("/").slice(0, -1).join("/")} not found!`
  ) as any
  err.statusCode = 404
  next(err)
})
