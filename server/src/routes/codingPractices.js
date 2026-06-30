import express from 'express';
import auth from '../middleware/auth.js';
import { 
    getCodingPractices, 
    updateProblemStatus, 
    getUserProgress,
    addCodingPracticeTrack,
    updateCodingPracticeTrack,
    deleteCodingPracticeTrack,
    addCodingPracticeProblem,
    updateCodingPracticeProblem,
    deleteCodingPracticeProblem
} from '../controllers/codingPractices.controller.js';

const router = express.Router();

// Public/User routes
router.get('/', getCodingPractices);
router.put('/update-problem-status/', auth, updateProblemStatus);
router.get("/user-progress", auth, getUserProgress);

// Admin routes
router.post('/track', auth, addCodingPracticeTrack);
router.put('/track/:id', auth, updateCodingPracticeTrack);
router.delete('/track/:id', auth, deleteCodingPracticeTrack);

router.post('/problem', auth, addCodingPracticeProblem);
router.put('/track/:trackId/problem/:problemId', auth, updateCodingPracticeProblem);
router.delete('/track/:trackId/problem/:problemId', auth, deleteCodingPracticeProblem);

export default router;
