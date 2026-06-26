import express from 'express';
import auth from '../middleware/auth.js';
import { getCommunityPosts, createCommunityPost, toggleLike } from '../controllers/community.controller.js';

const router = express.Router();

// @route   GET api/community
// @desc    Get recent community posts (paginated)
// @access  Private
router.get('/', auth, getCommunityPosts);

// @route   POST api/community
// @desc    Create a new community post
// @access  Private
router.post('/', auth, createCommunityPost);

// @route   POST api/community/:id/like
// @desc    Toggle like on a post
// @access  Private
router.post('/:id/like', auth, toggleLike);

export default router;
