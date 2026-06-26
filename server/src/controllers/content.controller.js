import Content from '../models/Content.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getContent = asyncHandler(async (req, res) => {
    const content = await Content.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, content, "Success"));
});

export const createContent = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
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
    if (req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied');
    }

    let content = await Content.findById(req.params.id);
    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    content = await Content.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
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
