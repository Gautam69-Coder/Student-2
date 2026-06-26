import Section from '../models/Section.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getSections = asyncHandler(async (req, res) => {
    const sections = await Section.find();
    res.status(200).json(new ApiResponse(200, sections, "Success"));
});

export const createSection = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const existingSection = await Section.findOne({ name });
    if (existingSection) {
        throw new ApiError(400, 'Section already exists');
    }
    const newSection = new Section({ name });
    const section = await newSection.save();
    res.status(201).json(new ApiResponse(201, section, "Section created successfully"));
});

export const deleteSection = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        throw new ApiError(403, 'Access denied');
    }

    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
        throw new ApiError(404, 'Section not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Section removed'));
});
