"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBroadcast = exports.editBroadcast = exports.createBroadcast = exports.getAllBroadcasts = exports.getBroadcastById = exports.deleteNewsPost = exports.editNewsPost = exports.createNewsPost = exports.getAllNewsPosts = exports.getNewsPostById = void 0;
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
        const userId = req.user?.id;
        // console.log("the user is", req.user, "the id is", req.user?.id)
        const { title, desc, author, } = req.body;
        let thumbnailUrl = '';
        if (req.file) {
            const file = req.file;
            thumbnailUrl = await (0, upload_1.uploadToCloudinary)(file, 'news-thumbnails', userId);
        }
        const newsPost = await db_1.prisma.post.create({
            data: {
                title,
                desc,
                thumbnailUrl,
                author,
                userLikeId: userId,
                userDislikeId: userId,
                userId,
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
        const userId = req.user?.id;
        const { title, desc, author, } = req.body;
        const post = await db_1.prisma.post.findFirst({
            where: {
                id: postId
            }
        });
        if (!post)
            return next(new utils_1.ErrorHandler("Post not found", 404));
        let thumbnailUrl = post.thumbnailUrl;
        if (req.file) {
            const file = req.file;
            thumbnailUrl = await (0, upload_1.uploadToCloudinary)(file, 'news-thumbnails', userId);
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
        const userId = ""; //for testing
        const { title, desc, author } = req.body;
        let thumbnailUrl = '';
        if (req.file) {
            const file = req.file;
            thumbnailUrl = await (0, upload_1.uploadToCloudinary)(file, 'broadcast-thumbnails', userId);
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
        const userId = ""; //for testing
        const { title, desc, author } = req.body;
        const broadcast = await db_1.prisma.broadcast.findFirst({
            where: {
                id: broadcastId
            }
        });
        if (!broadcast)
            return next(new utils_1.ErrorHandler("Broadcast not found", 404));
        let thumbnailUrl = broadcast.thumbnailUrl;
        if (req.file) {
            const file = req.file;
            thumbnailUrl = await (0, upload_1.uploadToCloudinary)(file, 'broadcast-thumbnails', userId);
        }
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
// export const testingCloudUpload = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // let thumbnailUrl = '';
//         if (req.file) {
//             const uploadedFile: FileUploadFormat = req.file;
//             const thumbnails = await uploadToCloudinary(uploadedFile, "test-folder")
//             if (thumbnails){
//                 res.status(201).json({ 
//                     success: true,
//                     message: 'Cloudinary is working', 
//                     data: thumbnails
//                 })
//             }
//             } else{
//                 return res.status(400).json({ success: false, message: 'No file uploaded.' });
//             } 
//         }
//         catch (error: any) {
//         console.error("kini error yen", error)
//         return next(new ErrorHandler('Internal Server Error', 500));
//       }
// })
