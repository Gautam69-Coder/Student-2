import Track from "../models/ActivityTracker.js";
import User from "../models/User.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const updateVisitCount = asyncHandler(async (req, res) => {
    const { section } = req.body;
    const userId = req.user.id;
    console.log("Test commit");
    const validSections = ['home', 'notes', 'practicals', 'community', 'feedback', 'aboutcontact'];

    if (!validSections.includes(section)) {
        throw new ApiError(400, 'Invalid section');
    }

    const userName = await User.findById(userId);

    const tracker = await Track.findOneAndUpdate(
        { _id: userId },
        {
            $inc: { [`${section}.visitCount`]: 1 },
            $setOnInsert: { username: userName.username }, // this will work only one time 
        },
        { upsert: true, new: true }
    );

    res.status(200).json(new ApiResponse(200, { tracker }, 'Visit count updated'));
});

export const getTrackData = asyncHandler(async (req, res) => {
    const trackData = await Track.find();
    res.status(200).json(new ApiResponse(200, { trackData }, 'Visit count updated'));
});
