import express from 'express';
import auth from '../middleware/auth.js';
import { submitFeedback, getFeedback, updateFeedbackStatus } from '../controllers/feedback.controller.js';

const router = express.Router();
// @route   POST api/feedback
// @desc    Submit feedback
// @access  Private
router.post('/', auth, submitFeedback);

// @route   GET api/feedback
// @desc    Get all feedback (Admin only)
// @access  Private
router.get('/', auth, getFeedback);

// @route   PATCH api/feedback/:id
// @desc    Update feedback status
// @access  Private
router.patch('/:id', auth, updateFeedbackStatus);

export default router;
