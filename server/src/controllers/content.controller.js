import Content from '../models/Content.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getContent = asyncHandler(async (req, res) => {
    const content = await Content.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, content, "Success"));
});

export const createContent = asyncHandler(async (req, res) => {
    if (!['admin', 'superadmin'].includes(req.user.role)) {
        throw new ApiError(403, 'Access denied');
    }

    const { title, description, code, language, section, rating, likes, downloads } = req.body;
    const newContent = new Content({
        title, description, code, language, section, rating, likes, downloads
    });
    const content = await newContent.save();
    res.status(201).json(new ApiResponse(201, content, "Content created successfully"));
});

export const updateContent = asyncHandler(async (req, res) => {
    if (!['admin', 'superadmin'].includes(req.user.role)) {
        throw new ApiError(403, 'Access denied');
    }

    let content = await Content.findById(req.params.id);
    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    // BUG-8 fix: Whitelist allowed fields instead of $set: req.body
    const { title, description, code, language, section, rating, likes, downloads } = req.body;
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (code !== undefined) updateFields.code = code;
    if (language !== undefined) updateFields.language = language;
    if (section !== undefined) updateFields.section = section;
    if (rating !== undefined) updateFields.rating = rating;
    if (likes !== undefined) updateFields.likes = likes;
    if (downloads !== undefined) updateFields.downloads = downloads;

    content = await Content.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true });
    res.status(200).json(new ApiResponse(200, content, "Content updated successfully"));
});

export const deleteContent = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied');
    }

    let content = await Content.findById(req.params.id);
    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    await Content.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Content removed'));
});
