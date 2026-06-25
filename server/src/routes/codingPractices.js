import express from 'express';
import CodingPractice from '../models/CodingPractice.js';
import UserProgress from '../models/UserProgress.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all coding practice tracks
router.get('/', async (req, res) => {
    try {
        const tracks = await CodingPractice.find().sort({ createdAt: -1 });
        res.json(tracks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.put('/update-problem-status/', auth, async (req, res) => {
    try {
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

        res.status(200).json(
            { success: true, statusData: updateProblemStatus },
        )
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Problem Status not updated", error: error })
    }
})

router.get("/user-progress", auth, async (req, res) => {
    const userProgress = await UserProgress.find();
    res.status(200).json({ success: true, data: userProgress })
})

export default router;

