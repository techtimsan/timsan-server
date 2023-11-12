"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const constants_1 = require("./lib/constants");
const app = (0, express_1.default)();
// enable case-sensitivity for routes
app.set("case sensitive routing", true);
// enable strict routing
app.set("strict routing", true);
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// cors options
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
// cookies
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
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
app.use("/", (req, res, next) => {
    res.json({ msg: "Hello" });
});
// Catch 404 and forward to error handler
app.use((err, req, res, next) => {
    if (req.statusCode === 429) {
        // const retryAfter = rateLimiter
        // res.setHeader("Retry-After", "")
        // res.header("", "")
        res.status(429).json({
            message: "Rate Limit exceeded. Please try again later.",
        });
    }
    res.status(404).json({
        message: "Route Not Found!, ⚠ . Check the Route Carefully and Try Again. ⚒ - Routes are case-sensitive ➕  remove trailing forward slashes.",
    });
});
app.listen(constants_1.PORT, () => {
    console.log(`TIMSAN API BACKEND - Listening on PORT : ${constants_1.PORT}`);
});
