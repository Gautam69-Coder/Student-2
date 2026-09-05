import express from 'express';
import auth from '../middleware/auth.js';
import uploadMulter from '../middleware/multer.js';
import { getPracticals, createPractical, updatePractical, deletePractical } from '../controllers/practicals.controller.js';

const router = express.Router();

router.get('/', auth, getPracticals);
router.post('/', auth, uploadMulter.array("files"), createPractical);
router.put('/:id', auth, uploadMulter.array("files"), updatePractical);
router.delete('/:id', auth, deletePractical);

export default router;
