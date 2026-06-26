import GuestVisit from '../models/GuestVisit.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const trackGuestVisit = asyncHandler(async (req, res) => {
    const { section = 'home', device = 'Unknown Device', country = 'Unknown', userAgent = '' } = req.body;
    const now = new Date();

    const guestVisit = new GuestVisit({
        section,
        visitDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        visitTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        device,
        country,
        userAgent,
    });

    await guestVisit.save();

    res.status(201).json(new ApiResponse(201, guestVisit, 'Guest visit saved'));
});

export const getGuestVisits = asyncHandler(async (req, res) => {
    const guestVisits = await GuestVisit.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, { guestVisits }, 'Success'));
});
