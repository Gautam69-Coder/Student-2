import CodingPractice from '../models/CodingPractice.js';
import UserProgress from '../models/UserProgress.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getCodingPractices = asyncHandler(async (req, res) => {
    const tracks = await CodingPractice.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, tracks, 'Success'));
});

export const updateProblemStatus = asyncHandler(async (req, res) => {
    const { data } = req.body;
    const userId = req.user.id;
    const total = await CodingPractice.findOne().select("totalProblems");
    console.log(total);
    const updateProblemStatus = await UserProgress.findOneAndUpdate(
        {
            userId,
            codingLanguage: data.language,
        },
        {
            $addToSet: {
                completedProblems: data.problemId
            },
            $set: {
                totalProblems: total.totalProblems,
                day: data.day || "Monday",
            }
        },
        {
            new: true,
            upsert: true,
        }
    );

    res.status(200).json(new ApiResponse(200, updateProblemStatus, "Problem Status updated"));
});

export const getUserProgress = asyncHandler(async (req, res) => {
    const userProgress = await UserProgress.find();
    res.status(200).json(new ApiResponse(200, userProgress, "Success"));
});
