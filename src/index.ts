import express, { Express, Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import { PORT } from "./lib/constants"

const app: Express = express()

// enable case-sensitivity for routes
app.set("case sensitive routing", true)

// enable strict routing
app.set("strict routing", true)

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// cors options
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
)

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

// healthcheck
app.use("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ msg: "Hello" })
})

// Catch 404 and forward to error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (req.statusCode === 429) {
    // const retryAfter = rateLimiter
    // res.setHeader("Retry-After", "")
    // res.header("", "")
    res.status(429).json({
      message: "Rate Limit exceeded. Please try again later.",
    })
  }

  res.status(404).json({
    message:
      "Route Not Found!, ⚠ . Check the Route Carefully and Try Again. ⚒ - Routes are case-sensitive ➕  remove trailing forward slashes.",
  })
})

app.listen(PORT, () => {
  console.log(`TIMSAN API BACKEND - Listening on PORT : ${PORT}`)
})
