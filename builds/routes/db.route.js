"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbRoute = void 0;
const express_1 = require("express");
const db_service_1 = require("../controllers/db.service");
exports.dbRoute = (0, express_1.Router)();
exports.dbRoute.post("/", db_service_1.dbHealthCheck);
