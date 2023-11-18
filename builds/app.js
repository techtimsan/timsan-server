"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const constants_1 = require("./lib/constants");
const routes_1 = require("./routes");
const middlewares_1 = require("./middlewares");
exports.app = (0, express_1.default)();
// // enable case-sensitivity for routes
exports.app.set("case sensitive routing", true);
// // enable strict routing
exports.app.set("strict routing", true);
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.disable("x-powered-by");
// cors options
exports.app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
// cookies
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, morgan_1.default)("dev"));
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
exports.app.use(constants_1.AUTH_ROUTE, routes_1.authRoute);
exports.app.use(constants_1.CONFERENCE_ROUTE, routes_1.conferenceRoute);
// healthcheck
// app.get("/", (req: Request, res: Response, next: NextFunction) => {
//   return next()
// })
// Catch 404 and forward to error handler
exports.app.all("*", (req, res, next) => {
    const err = new Error(`${req.method} - ${req.url.split("/").slice(0, -1).join("/")} not found!`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(middlewares_1.errorMiddleware);
