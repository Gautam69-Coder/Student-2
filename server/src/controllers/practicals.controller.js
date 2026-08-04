import Practical from '../models/Practical.js';
import { uploadCloudinary } from '../utils/uploadCloudinary.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getPracticals = asyncHandler(async (req, res) => {
    const practicals = await Practical.find().collation({ locale: "en", numericOrdering: true });
    res.status(200).json(new ApiResponse(200, practicals, "Success"));
});

export const createPractical = asyncHandler(async (req, res) => {
    const { practicalNumber, section } = req.body;

    console.log("Practical Data : ",practicalNumber);
    console.log("Practical Section : ",section);
    


    let questions = req.body.questions;
    questions = JSON.parse(questions);

    console.log("Practical Section : ",questions);

    const files = req.files || [];

    let fileIndexMap = req.body.fileIndexMap ? JSON.parse(req.body.fileIndexMap) : [];

    const uploadedFiles = await Promise.all(
        files.map(file => uploadCloudinary(file.path))
    );

    fileIndexMap.forEach((questionIndex, fileArrayIndex) => {
        const uploaded = uploadedFiles[fileArrayIndex];
        if (uploaded) {
            questions[questionIndex].fileUrl = uploaded.secure_url;
            questions[questionIndex].filePublicId = uploaded.public_id;
            console.log(`Question ${questionIndex} File:`, uploaded.secure_url);
        }
    });


    const newPractical = new Practical({
        practicalNumber,
        section,
        questions
    });

    const practical = await newPractical.save();
    res.status(201).json(new ApiResponse(201, practical, "Practical Created Successfully"));
});

export const updatePractical = asyncHandler(async (req, res) => {
    const { practicalNumber, section } = req.body;
    let questions = JSON.parse(req.body.questions);
    const files = req.files || [];
    let fileIndexMap = req.body.fileIndexMap ? JSON.parse(req.body.fileIndexMap) : [];

    let practical = await Practical.findById(req.params.id);
    if (!practical) {
        throw new ApiError(404, 'Practical not found');
    }

    if (files.length > 0) {
        const uploadedFiles = await Promise.all(
            files.map(file => uploadCloudinary(file.path))
        );

        fileIndexMap.forEach((questionIndex, fileArrayIndex) => {
            const uploaded = uploadedFiles[fileArrayIndex];
            if (uploaded) {
                questions[questionIndex].fileUrl = uploaded.secure_url;
                questions[questionIndex].filePublicId = uploaded.public_id;
            }
        });
    }

    practical.practicalNumber = practicalNumber;
    practical.section = section;
    practical.questions = questions;

    await practical.save();
    res.status(200).json(new ApiResponse(200, practical, "Practical updated successfully"));
});

export const deletePractical = asyncHandler(async (req, res) => {
    const practical = await Practical.findByIdAndDelete(req.params.id);
    if (!practical) {
        throw new ApiError(404, 'Practical not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Practical deleted'));
});
