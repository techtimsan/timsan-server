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
const path_1 = __importDefault(require("path"));
const middlewares_1 = require("./middlewares");
const newsletter_route_1 = require("./routes/newsletter.route");
const profile_route_1 = require("./routes/profile.route");
const e_library_route_1 = require("./routes/e-library.route");
const tilets_route_1 = require("./routes/tilets.route");
exports.app = (0, express_1.default)();
// // enable case-sensitivity for routes
exports.app.set("case sensitive routing", true);
// // enable strict routing
exports.app.set("strict routing", true);
// app.use(express.json())
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.disable("x-powered-by");
// cors options
exports.app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 204
}));
// cookies
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, morgan_1.default)("dev"));
// Set the view engine to EJS
exports.app.set("view engine", "ejs");
exports.app.set("views", path_1.default.join(__dirname, "/lib/mail"));
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
exports.app.use(constants_1.NEWS_ROUTE, routes_1.newsRoute);
exports.app.use(constants_1.REDIS_ROUTE, routes_1.redisRoute);
exports.app.use(constants_1.BROADCAST_ROUTE, routes_1.broadcastRoute);
exports.app.use(constants_1.NEWSLETTER_ROUTE, newsletter_route_1.newsletterRoute);
exports.app.use(constants_1.PROFILE_ROUTE, profile_route_1.profileRoute);
exports.app.use(constants_1.ELIBRARY_ROUTE, e_library_route_1.eLibraryRoute);
exports.app.use(constants_1.TILETS_ROUTE, tilets_route_1.tiletsRoute);
// healthcheck
exports.app.get("/", (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "Welcome! I hope you're Authorized to be here!!!",
    });
});
// Catch 404 and forward to error handler
exports.app.all("*", (req, res, next) => {
    const err = new Error(`${req.method} - ${req.url.split("/").slice(0, -1).join("/")} not found!`);
    err.statusCode = 404;
    next(err);
});
// error handler middleware
exports.app.use(middlewares_1.errorMiddleware);
