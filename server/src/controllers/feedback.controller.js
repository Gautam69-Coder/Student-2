import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const submitFeedback = asyncHandler(async (req, res) => {
    const { title, message, category } = req.body;
    const newFeedback = new Feedback({
        userId: req.user.id,
        title,
        message,
        category
    });

    const feedback = await newFeedback.save();
    res.status(201).json(new ApiResponse(201, feedback, "Feedback submitted successfully"));
});

export const getFeedback = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!['admin', 'superadmin'].includes(user.role)) {
        throw new ApiError(403, 'Access denied');
    }

    const feedbacks = await Feedback.find().populate('userId', 'username email').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, feedbacks, "Success"));
});

export const updateFeedbackStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const user = await User.findById(req.user.id);
    if (!['admin', 'superadmin'].includes(user.role)) {
        throw new ApiError(403, 'Access denied');
    }

    let feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
        throw new ApiError(404, 'Feedback not found');
    }

    feedback.status = status;
    await feedback.save();

    res.status(200).json(new ApiResponse(200, feedback, "Feedback updated successfully"));
});
