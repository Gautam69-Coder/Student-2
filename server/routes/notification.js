
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
            time: time
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

export default router;