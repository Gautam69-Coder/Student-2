import express from 'express';
import auth from '../middleware/auth.js';
import { trackGuestVisit, getGuestVisits } from '../controllers/guestTrack.controller.js';

const router = express.Router();

router.post('/', trackGuestVisit);
router.get('/', auth, getGuestVisits);

export default router;