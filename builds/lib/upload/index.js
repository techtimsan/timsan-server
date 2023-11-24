"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudUpload = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudUpload", { enumerable: true, get: function () { return cloudinary_1.v2; } });
cloudinary_1.v2.config({
    cloud_name: "drcsdfkjr",
    api_key: "365776684397868",
    api_secret: 'mR9etvE4CBw16p-Yw0nBDd1VLqY',
    secure: true
});
async function uploadToCloudinary(file, folderName) {
    try {
        const uploadedImage = await cloudinary_1.v2.uploader.upload(file.path, {
            folder: folderName,
        });
        return uploadedImage.secure_url;
    }
    catch (error) {
        throw new Error('Error uploading file to Cloudinary');
    }
}
exports.uploadToCloudinary = uploadToCloudinary;
