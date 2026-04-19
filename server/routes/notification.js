
import express from 'express';
import auth from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { title, message } = req.body;
        const date = new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'Asia/Kolkata',
        });
        const time = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Asia/Kolkata',
        });

        const notification = new Notification({
            userId: req.user.id,
            title,
            message,
            date: date,
            time: time,
        });
        await notification.save();

        return res.json(notification);

    } catch (err) {
        console.error("Error sending notification:", err);
        return res.status(500).json({ msg: 'Server error. Please try again later.' });
    }
});

router.get('/', async (req, res) => {
    try {

        const getNotification = await Notification.find();
        return res.json(getNotification);
    }
    catch (err) {
        console.error("Error geting notification:", err);
    }
})

router.post("/notification-status", auth, async (req, res) => {
    try {
        const { isRead, notificationId } = req.body;
        
        if (!notificationId) {
            return res.status(400).json({ msg: 'Notification ID is required' });
        }

        const notificationStatus = await Notification.findByIdAndUpdate(
            notificationId,
            {
                $set: { isRead }
            },
            { new: true }
        );

        if (!notificationStatus) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        return res.json(notificationStatus);
    } catch (error) {
        console.error("Notification status not updated", error);
        return res.status(500).json({ msg: 'Server error' });
    }
})

export default router;