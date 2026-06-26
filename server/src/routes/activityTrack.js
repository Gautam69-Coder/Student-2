import express from 'express';
import auth from '../middleware/auth.js';
import { updateVisitCount, getTrackData } from '../controllers/activityTrack.controller.js';

const router = express.Router();

router.post('/', auth, updateVisitCount);
router.get('/', getTrackData);

export default router;