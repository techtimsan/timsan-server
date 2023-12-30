"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.cloudUpload = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudUpload", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const constants_1 = require("../constants");
cloudinary_1.v2.config({
    cloud_name: constants_1.CLOUDINARY_CLOUD_NAME,
    api_key: constants_1.CLOUDINARY_API_KEY,
    api_secret: constants_1.CLOUNDINAR_SECRET_KEY
});
async function uploadToCloudinary(file, folderName, userId) {
    try {
        const uploadedImage = await cloudinary_1.v2.uploader.upload(file.path, {
            public_id: `${folderName}-${userId}`, folder: folderName
        });
        return uploadedImage.secure_url;
    }
    catch (error) {
        throw new Error('Error uploading file to Cloudinary');
    }
}
exports.uploadToCloudinary = uploadToCloudinary;
