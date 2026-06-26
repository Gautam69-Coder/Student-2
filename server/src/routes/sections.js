import express from 'express';
import auth from '../middleware/auth.js';
import { getSections, createSection, deleteSection } from '../controllers/sections.controller.js';

const router = express.Router();

// Get all sections
router.get('/', getSections);

// Create Section (Admin only)
router.post('/', auth, createSection);

// Delete Section (Admin only)
router.delete('/:id', auth, deleteSection);

export default router;
