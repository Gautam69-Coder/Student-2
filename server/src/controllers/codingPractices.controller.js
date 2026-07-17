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
    // BUG-17 fix: Removed console.log of DB data
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

export const addCodingPracticeTrack = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        throw new ApiError(403, 'Access denied. Admins only.');
    }
    const { title, description, language, level } = req.body;
    if (!title || !description || !language || !level) {
        throw new ApiError(400, 'All fields (title, description, language, level) are required');
    }

    const track = await CodingPractice.create({
        title,
        description,
        language,
        level,
        totalProblems: 0,
        problemList: []
    });

    res.status(201).json(new ApiResponse(201, track, 'Coding practice track created successfully'));
});

export const updateCodingPracticeTrack = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        throw new ApiError(403, 'Access denied. Admins only.');
    }
    const { id } = req.params;
    const { title, description, language, level, status } = req.body;

    const track = await CodingPractice.findById(id);
    if (!track) {
        throw new ApiError(404, 'Track not found');
    }

    if (title !== undefined) track.title = title;
    if (description !== undefined) track.description = description;
    if (language !== undefined) track.language = language;
    if (level !== undefined) track.level = level;
    if (status !== undefined) track.status = status;

    await track.save();

    res.status(200).json(new ApiResponse(200, track, 'Coding practice track updated successfully'));
});

export const deleteCodingPracticeTrack = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        throw new ApiError(403, 'Access denied. Admins only.');
    }
    const { id } = req.params;

    const track = await CodingPractice.findByIdAndDelete(id);
    if (!track) {
        throw new ApiError(404, 'Track not found');
    }

    res.status(200).json(new ApiResponse(200, null, 'Coding practice track deleted successfully'));
});

export const addCodingPracticeProblem = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        throw new ApiError(403, 'Access denied. Admins only.');
    }
    const { trackId, question, problemDiscription, difficulty, examples } = req.body;
    if (!trackId || !question || !problemDiscription || !difficulty) {
        throw new ApiError(400, 'Required fields: trackId, question, problemDiscription, difficulty');
    }

    const track = await CodingPractice.findById(trackId);
    if (!track) {
        throw new ApiError(404, 'Track not found');
    }

    const newProblem = {
        question,
        problemDiscription,
        difficulty,
        examples: examples || [],
        isCompleted: false
    };

    track.problemList.push(newProblem);
    track.totalProblems = track.problemList.length;
    await track.save();

    res.status(201).json(new ApiResponse(201, track, 'Problem added successfully'));
});

export const updateCodingPracticeProblem = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        throw new ApiError(403, 'Access denied. Admins only.');
    }
    const { trackId, problemId } = req.params;
    const { question, problemDiscription, difficulty, examples } = req.body;

    const track = await CodingPractice.findById(trackId);
    if (!track) {
        throw new ApiError(404, 'Track not found');
    }

    const problem = track.problemList.id(problemId);
    if (!problem) {
        throw new ApiError(404, 'Problem not found');
    }

    if (question !== undefined) problem.question = question;
    if (problemDiscription !== undefined) problem.problemDiscription = problemDiscription;
    if (difficulty !== undefined) problem.difficulty = difficulty;
    if (examples !== undefined) problem.examples = examples;

    await track.save();

    res.status(200).json(new ApiResponse(200, track, 'Problem updated successfully'));
});

export const deleteCodingPracticeProblem = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        throw new ApiError(403, 'Access denied. Admins only.');
    }
    const { trackId, problemId } = req.params;

    const track = await CodingPractice.findById(trackId);
    if (!track) {
        throw new ApiError(404, 'Track not found');
    }

    const problem = track.problemList.id(problemId);
    if (!problem) {
        throw new ApiError(404, 'Problem not found');
    }

    track.problemList.pull({ _id: problemId });
    track.totalProblems = track.problemList.length;
    await track.save();

    res.status(200).json(new ApiResponse(200, track, 'Problem deleted successfully'));
});
