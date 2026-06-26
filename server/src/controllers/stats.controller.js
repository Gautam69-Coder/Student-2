import Practical from '../models/Practical.js';
import GuestVisit from '../models/GuestVisit.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
    const [totalPracticals, activePracticesCount, activeSubjectSections, platformVisitsCount] =
        await Promise.all([
            Practical.countDocuments(),
            Practical.countDocuments(),
            Practical.distinct('section'),
            GuestVisit.countDocuments(),
        ]);

    res.status(200).json(new ApiResponse(200, {
        activePractices: activePracticesCount,
        activePracticalSubjectsCount: activeSubjectSections.length,
        totalPracticals,
        platformVisits: platformVisitsCount,
    }, "Success"));
});
