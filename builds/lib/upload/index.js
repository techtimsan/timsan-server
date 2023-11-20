"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudUpload = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudUpload", { enumerable: true, get: function () { return cloudinary_1.v2; } });
cloudinary_1.v2.config({
    cloud_name: "",
    api_key: "",
    api_secret: ""
});
