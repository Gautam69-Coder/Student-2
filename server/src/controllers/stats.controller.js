import Practical from '../models/Practical.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
    const [totalPracticals, activePracticesCount, activeSubjectSections, usersVisitsResult] =
        await Promise.all([
            Practical.countDocuments(),
            Practical.countDocuments(),
            Practical.distinct('section'),
            User.aggregate([
                { $group: { _id: null, total: { $sum: "$visitCount" } } }
            ]),
        ]);

    const platformVisitsCount = usersVisitsResult[0]?.total || 0;

    res.status(200).json(new ApiResponse(200, {
        activePractices: activePracticesCount,
        activePracticalSubjectsCount: activeSubjectSections.length,
        totalPracticals,
        platformVisits: platformVisitsCount,
    }, "Success"));
});
