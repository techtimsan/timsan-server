"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisRoute = exports.broadcastRoute = exports.newsRoute = exports.conferenceRoute = exports.authRoute = void 0;
var auth_route_1 = require("./auth.route");
Object.defineProperty(exports, "authRoute", { enumerable: true, get: function () { return auth_route_1.authRoute; } });
var conference_route_1 = require("./conference.route");
Object.defineProperty(exports, "conferenceRoute", { enumerable: true, get: function () { return conference_route_1.conferenceRoute; } });
var news_route_1 = require("./news.route");
Object.defineProperty(exports, "newsRoute", { enumerable: true, get: function () { return news_route_1.newsRoute; } });
var broadcast_route_1 = require("./broadcast.route");
Object.defineProperty(exports, "broadcastRoute", { enumerable: true, get: function () { return broadcast_route_1.broadcastRoute; } });
var redis_route_1 = require("./redis.route");
Object.defineProperty(exports, "redisRoute", { enumerable: true, get: function () { return redis_route_1.redisRoute; } });
// export { profileRoute } from "./profile.routes"
