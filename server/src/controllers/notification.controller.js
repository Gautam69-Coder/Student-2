import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createNotification = asyncHandler(async (req, res) => {
    const { title, message } = req.body;
    const date = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
    });
    const time = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Kolkata',
    });

    const notification = new Notification({
        userId: req.user.id,
        title,
        message,
        date: date,
        time: time,
    });
    await notification.save();

    res.status(201).json(new ApiResponse(201, notification, "Notification sent"));
});

export const getNotifications = asyncHandler(async (req, res) => {
    const getNotification = await Notification.find();
    res.status(200).json(new ApiResponse(200, getNotification, "Success"));
});

export const updateNotificationStatus = asyncHandler(async (req, res) => {
    const { isRead, notificationId } = req.body;
    
    if (!notificationId) {
        throw new ApiError(400, 'Notification ID is required');
    }

    const notificationStatus = await Notification.findByIdAndUpdate(
        notificationId,
        {
            $set: { isRead }
        },
        { new: true }
    );

    if (!notificationStatus) {
        throw new ApiError(404, 'Notification not found');
    }

    res.status(200).json(new ApiResponse(200, notificationStatus, "Notification status updated"));
});
