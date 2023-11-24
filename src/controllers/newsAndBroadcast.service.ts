import { NextFunction, Request, Response } from "express";
import { asyncErrorMiddleware } from "../middlewares";
import { BroadcastData, FileUploadFormat, PostData } from "../types/app";
import { prisma } from "../lib/db";
import { ErrorHandler } from "../utils";
import {cloudUpload, uploadToCloudinary} from "../lib/upload";


/**
 * NEWS CONTROLLERS
 * GOES HERE
 */
export const getNewsPostById = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params; 

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if (!post) {
            return next(new ErrorHandler('Post not found', 404));
        }

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error: any) {
        return next(new ErrorHandler('Internal Server Error', 500));
    }
});

export const getAllNewsPosts = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allPosts = await prisma.post.findMany();

        res.status(200).json({
            success: true,
            data: allPosts,
        });
    } catch (error: any) {
        return next(new ErrorHandler('Internal Server Error', 500));
    }
});



export const createNewsPost = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const {
            title, 
            desc,
            author, 
            userId,
            // userLikeId,
            // userDislikeId,
        }: PostData = req.body

        let thumbnailUrl = '';
        if (req.file) {
            const file: FileUploadFormat = req.file;
            thumbnailUrl = await uploadToCloudinary(file, 'news-thumbnails', userId);
        }
        const newsPost = await prisma.post.create({
            data: {
                title,
                desc,
                thumbnailUrl,
                author,
                userLikeId: "clpb2wy4l0000nzt7t6ugs74s",
                userDislikeId: "clpb2wy4l0000nzt7t6ugs74s",
                userId
            }
        })
        if (newsPost){
            res.status(201).json({ 
                success: true,
                message: 'News post created successfully', 
                data: newsPost 
            });
        }
    } catch (error: any) {
        console.error("kini error yen", error)
        return next(new ErrorHandler('Internal Server Error', 500));
      }
})

export const editNewsPost = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;
        const userId = "" //for testing
        const {
            title,
            desc,
            author,
            // userId,
            // userLikeId,
            // userDislikeId,
        }: PostData = req.body;

        const post = await prisma.post.findFirst({
            where: {
                id: postId
            }
        })
        if (!post) return next(new ErrorHandler("Post not found", 404))
        
        let thumbnailUrl = post.thumbnailUrl;
        if (req.file) {
            const file: FileUploadFormat = req.file;
            thumbnailUrl = await uploadToCloudinary(file, 'news-thumbnails', userId);
        }
        const updatedPost = await prisma.post.update({
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
        } else {
            return next(new ErrorHandler('Failed to update post', 500));
        }
    } catch (error: any) {
        return next(new ErrorHandler('Internal Server Error', 500));
    }
})

export const deleteNewsPost = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params; 

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if (!post) {
            return next(new ErrorHandler('Post not found', 404));
        }

        await prisma.post.delete({
            where: {
                id: postId,
            },
        });

        res.status(200).json({
            success: true,
            message: 'News post deleted successfully',
        });
    } catch (error: any) {
        return next(new ErrorHandler('Internal Server Error', 500));
    }
});


/**
 * BROADCAST CONTROLLERS
 * GOES HERE
 */

export const getBroadcastById = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { broadcastId } = req.params; 

        const bc = await prisma.broadcast.findUnique({
            where: {
                id: broadcastId,
            },
        });

        if (!bc) {
            return next(new ErrorHandler('BC not found', 404));
        }

        res.status(200).json({
            success: true,
            data: bc,
        });
    } catch (error: any) {
        return next(new ErrorHandler('Internal Server Error', 500));
    }
});

export const getAllBroadcasts = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allBroadcasts = await prisma.broadcast.findMany();

        res.status(200).json({
            success: true,
            data: allBroadcasts,
        });
    } catch (error: any) {
        return next(new ErrorHandler('Internal Server Error', 500));
    }
});



export const createBroadcast = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = "" //for testing
        const {
            title, 
            desc,
            author
        }: BroadcastData = req.body
        
        let thumbnailUrl = ''
        if (req.file) {
            const file: FileUploadFormat = req.file;
            thumbnailUrl = await uploadToCloudinary(file, 'broadcast-thumbnails', userId);
        }
        const broadcast = await prisma.broadcast.create({
            data: {
                title, 
                desc,
                thumbnailUrl, 
                author
            }
        })
        if (broadcast){
            res.status(201).json({ 
                success: true,
                message: 'Broadcast created successfully', 
                data: broadcast 
            });
        }
    } catch (error: any) {
        return next(new ErrorHandler('Internal Server Error', 500));
      }
})

export const editBroadcast = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { broadcastId } = req.params;
        
        const userId = "" //for testing
        const {
            title, 
            desc,
            author
        }: BroadcastData = req.body

        const broadcast = await prisma.broadcast.findFirst({
            where: {
                id: broadcastId
            }
        })
        if (!broadcast) return next(new ErrorHandler("Broadcast not found", 404))
        
        let thumbnailUrl = broadcast.thumbnailUrl
        if (req.file) {
            const file: FileUploadFormat = req.file;
            thumbnailUrl = await uploadToCloudinary(file, 'broadcast-thumbnails', userId);
        }

        const updatedBroadcast = await prisma.broadcast.update({
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
        } else {
            return next(new ErrorHandler('Failed to update broadcast', 500));
        }
    } catch (error: any) {
        return next(new ErrorHandler('Internal Server Error', 500));
    }
})

export const deleteBroadcast = asyncErrorMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { broadcastId } = req.params; 

        const broadcast = await prisma.broadcast.findUnique({
            where: {
                id: broadcastId,
            },
        });

        if (!broadcast) {
            return next(new ErrorHandler('Broadcast not found', 404));
        }

        await prisma.broadcast.delete({
            where: {
                id: broadcastId,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Broadcast deleted successfully',
        });
    } catch (error: any) {
        return next(new ErrorHandler('Internal Server Error', 500));
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