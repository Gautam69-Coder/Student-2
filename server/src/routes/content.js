import express from 'express';
import auth from '../middleware/auth.js';
import { getContent, createContent, updateContent, deleteContent } from '../controllers/content.controller.js';

const router = express.Router();

// Get all content
router.get('/', getContent);

// Create Content (Admin only)
router.post('/', auth, createContent);

// Update Content
router.put('/:id', auth, updateContent);

// Delete Content
router.delete('/:id', auth, deleteContent);

export default router;
