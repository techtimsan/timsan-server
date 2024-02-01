"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eLibraryRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_1 = require("../lib/validate/auth");
exports.eLibraryRoute = (0, express_1.Router)({
    caseSensitive: true,
    strict: true,
});
exports.eLibraryRoute.post("/", (0, auth_1.validateData)(auth_1.AddNewBookELibrarySchema), controllers_1.addNewBook);
exports.eLibraryRoute.get("/", controllers_1.getAllBooks);
