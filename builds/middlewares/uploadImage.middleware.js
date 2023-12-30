"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const multerConfig = {
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        callback(null, `timsanimg-${Date.now()}.${ext}`);
    },
};
const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    }
    else {
        callback(new Error('Only Image'));
    }
};
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage(multerConfig),
    limits: { fileSize: 1000000 },
    fileFilter: isImage,
});
const uploadImage = (req, res, next) => {
    const uploadMiddleware = upload.single('image');
    uploadMiddleware(req, res, (err) => {
        if (err) {
            res.status(400).send({ error: 'File upload failed', message: err.message });
        }
        else {
            next();
        }
    });
};
exports.uploadImage = uploadImage;
