import express from 'express';
import auth from '../middleware/auth.js';
import { createNotification, getNotifications, updateNotificationStatus } from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/', auth, createNotification);
router.get('/', getNotifications);
router.post("/notification-status", auth, updateNotificationStatus);

export default router;