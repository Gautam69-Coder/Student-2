import express from 'express';
import { trackGuestVisit, getGuestVisits } from '../controllers/guestTrack.controller.js';

const router = express.Router();

router.post('/', trackGuestVisit);
router.get('/', getGuestVisits);

export default router;