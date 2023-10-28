"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorMiddleware = void 0;
const asyncErrorMiddleware = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
};
exports.asyncErrorMiddleware = asyncErrorMiddleware;
