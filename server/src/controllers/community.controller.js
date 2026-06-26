import CommunityPost from '../models/CommunityPost.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getCommunityPosts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        CommunityPost.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        CommunityPost.countDocuments(),
    ]);

    res.status(200).json(new ApiResponse(200, {
        posts,
        page,
        total,
        totalPages: Math.ceil(total / limit),
    }, "Success"));
});

export const createCommunityPost = asyncHandler(async (req, res) => {
    const { title, content, username } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(400, 'Content is required');
    }

    const post = new CommunityPost({
        userId: req.user.id,
        username: username,
        title: title?.trim() || undefined,
        content: content.trim(),
    });

    await post.save();

    res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

export const toggleLike = asyncHandler(async (req, res) => {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    const userId = req.user.id.toString();
    const index = post.likedBy.findIndex((id) => id.toString() === userId);

    if (index > -1) {
        post.likedBy.splice(index, 1);
    } else {
        post.likedBy.push(userId);
    }

    await post.save();

    res.status(200).json(new ApiResponse(200, {
        id: post.id,
        likedBy: post.likedBy,
        likesCount: post.likedBy.length,
    }, "Like toggled successfully"));
});
