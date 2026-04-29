import express from 'express';
import GuestVisit from '../models/GuestVisit.js';
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { section = 'home', device = 'Unknown Device', country = 'Unknown', userAgent = '' } = req.body;
        const now = new Date();

        const guestVisit = new GuestVisit({
            section,
            visitDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            visitTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            device,
            country,
            userAgent,
        });

        await guestVisit.save();

        res.status(201).json({ msg: 'Guest visit saved', guestVisit });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const guestVisits = await GuestVisit.find().sort({ createdAt: -1 });
        res.json({ guestVisits });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

export default router;