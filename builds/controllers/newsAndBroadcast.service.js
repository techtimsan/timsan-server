"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingCloudUpload = exports.deleteBroadcast = exports.editBroadcast = exports.createBroadcast = exports.getAllBroadcasts = exports.getBroadcastById = exports.deleteNewsPost = exports.editNewsPost = exports.createNewsPost = exports.getAllNewsPosts = exports.getNewsPostById = void 0;
const middlewares_1 = require("../middlewares");
const db_1 = require("../lib/db");
const utils_1 = require("../utils");
const upload_1 = require("../lib/upload");
/**
 * NEWS CONTROLLERS
 * GOES HERE
 */
exports.getNewsPostById = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { postId } = req.params;
        const post = await db_1.prisma.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post) {
            return next(new utils_1.ErrorHandler('Post not found', 404));
        }
        res.status(200).json({
            success: true,
            data: post,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
exports.getAllNewsPosts = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const allPosts = await db_1.prisma.post.findMany();
        res.status(200).json({
            success: true,
            data: allPosts,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
exports.createNewsPost = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, desc, author,
        // userId 
        // userLikeId,
        // userDislikeId,
         } = req.body;
        let thumbnailUrl = '';
        if (req.file) {
            const file = req.file;
            thumbnailUrl = await (0, upload_1.uploadToCloudinary)(file, 'news-thumbnails');
        }
        const newsPost = await db_1.prisma.post.create({
            data: {
                title,
                desc,
                thumbnailUrl,
                author,
                userLikeId: "",
                userDislikeId: "",
                userId: "123456"
            }
        });
        if (newsPost) {
            res.status(201).json({
                success: true,
                message: 'News post created successfully',
                data: newsPost
            });
        }
    }
    catch (error) {
        console.error("kini error yen", error);
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
exports.editNewsPost = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { title, desc, author,
        // userId,
        // userLikeId,
        // userDislikeId,
         } = req.body;
        const post = await db_1.prisma.post.findFirst({
            where: {
                id: postId
            }
        });
        if (!post)
            return next(new utils_1.ErrorHandler("Post not found", 404));
        let thumbnailUrl = '';
        if (req.file) {
            const file = req.file;
            thumbnailUrl = await (0, upload_1.uploadToCloudinary)(file, 'news-thumbnails');
        }
        const updatedPost = await db_1.prisma.post.update({
            where: {
                id: postId
            },
            data: {
                title,
                desc,
                thumbnailUrl,
                author,
                // userId,
                // userLikeId,
                // userDislikeId,
            },
        });
        if (updatedPost) {
            res.status(200).json({
                success: true,
                message: 'News post updated successfully',
                data: updatedPost,
            });
        }
        else {
            return next(new utils_1.ErrorHandler('Failed to update post', 500));
        }
    }
    catch (error) {
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
exports.deleteNewsPost = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { postId } = req.params;
        const post = await db_1.prisma.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post) {
            return next(new utils_1.ErrorHandler('Post not found', 404));
        }
        await db_1.prisma.post.delete({
            where: {
                id: postId,
            },
        });
        res.status(200).json({
            success: true,
            message: 'News post deleted successfully',
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
/**
 * BROADCAST CONTROLLERS
 * GOES HERE
 */
exports.getBroadcastById = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { broadcastId } = req.params;
        const bc = await db_1.prisma.broadcast.findUnique({
            where: {
                id: broadcastId,
            },
        });
        if (!bc) {
            return next(new utils_1.ErrorHandler('BC not found', 404));
        }
        res.status(200).json({
            success: true,
            data: bc,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
exports.getAllBroadcasts = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const allBroadcasts = await db_1.prisma.broadcast.findMany();
        res.status(200).json({
            success: true,
            data: allBroadcasts,
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
exports.createBroadcast = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { title, desc, author } = req.body;
        let thumbnailUrl = '';
        if (req.file) {
            const file = req.file;
            thumbnailUrl = await (0, upload_1.uploadToCloudinary)(file, 'broadcast-thumbnails');
        }
        const broadcast = await db_1.prisma.broadcast.create({
            data: {
                title,
                desc,
                thumbnailUrl,
                author
            }
        });
        if (broadcast) {
            res.status(201).json({
                success: true,
                message: 'Broadcast created successfully',
                data: broadcast
            });
        }
    }
    catch (error) {
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
exports.editBroadcast = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { broadcastId } = req.params;
        const { title, desc, author } = req.body;
        let thumbnailUrl = '';
        if (req.file) {
            const file = req.file;
            thumbnailUrl = await (0, upload_1.uploadToCloudinary)(file, 'broadcast-thumbnails');
        }
        const broadcast = await db_1.prisma.broadcast.findFirst({
            where: {
                id: broadcastId
            }
        });
        if (!broadcast)
            return next(new utils_1.ErrorHandler("Broadcast not found", 404));
        const updatedBroadcast = await db_1.prisma.broadcast.update({
            where: {
                id: broadcastId
            },
            data: {
                title,
                desc,
                thumbnailUrl,
                author
            },
        });
        if (updatedBroadcast) {
            res.status(200).json({
                success: true,
                message: 'Broadcast updated successfully',
                data: updatedBroadcast,
            });
        }
        else {
            return next(new utils_1.ErrorHandler('Failed to update broadcast', 500));
        }
    }
    catch (error) {
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
exports.deleteBroadcast = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { broadcastId } = req.params;
        const broadcast = await db_1.prisma.broadcast.findUnique({
            where: {
                id: broadcastId,
            },
        });
        if (!broadcast) {
            return next(new utils_1.ErrorHandler('Broadcast not found', 404));
        }
        await db_1.prisma.broadcast.delete({
            where: {
                id: broadcastId,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Broadcast deleted successfully',
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
exports.testingCloudUpload = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        // let thumbnailUrl = '';
        if (req.file) {
            const file = req.body.file;
            const binaryData = Buffer.from(file, 'base64');
            const thumbnailUrl = await upload_1.cloudUpload.uploader.upload(binaryData.toString("utf-8"), {
                folder: "test-folder",
            });
            res.status(201).json({
                success: true,
                message: 'Cloudinary is working',
                data: thumbnailUrl
            });
        }
    }
    catch (error) {
        console.error("kini error yen", error);
        return next(new utils_1.ErrorHandler('Internal Server Error', 500));
    }
});
//   // Specify the path where you want to save the file
//   const filePath = path.join(__dirname, 'uploads', fileName);
//   // Write the binary data to the file
//   fs.writeFile(filePath, binaryDa
