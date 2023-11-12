"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorMiddleware = exports.errorMiddleware = void 0;
var error_middleware_1 = require("./error.middleware");
Object.defineProperty(exports, "errorMiddleware", { enumerable: true, get: function () { return error_middleware_1.errorMiddleware; } });
var asyncError_middleware_1 = require("./asyncError.middleware");
Object.defineProperty(exports, "asyncErrorMiddleware", { enumerable: true, get: function () { return asyncError_middleware_1.asyncErrorMiddleware; } });
