import express from 'express';
import auth from '../middleware/auth.js';
import { getCodingPractices, updateProblemStatus, getUserProgress } from '../controllers/codingPractices.controller.js';

const router = express.Router();

// Get all coding practice tracks
router.get('/', getCodingPractices);

router.put('/update-problem-status/', auth, updateProblemStatus);

router.get("/user-progress", auth, getUserProgress);

export default router;
