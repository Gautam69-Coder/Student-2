import express from 'express';
import auth from '../middleware/auth.js';
import Track from "../models/ActivityTracker.js"
import User from "../models/User.js"
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { section } = req.body;
        const userId = req.user.id;

        const validSections = ['home', 'notes', 'practicals', 'community', 'feedback', 'aboutcontact'];

        if (!validSections.includes(section)) {
            return res.status(400).json({ msg: 'Invalid section' })
        }

        const newEntry = {
            date: new Date().toLocaleDateString(),
            currentTime: new Date().toLocaleTimeString()
        };



        const userName = await User.findById(userId)

        const tracker = await Track.findOneAndUpdate(
            { _id: userId },
            {
                $inc: { [`${section}.visitCount`]: 1 },
                $setOnInsert: { username: userName.username }, // this will work only one time 
                // $push: { [`${section}.history`]: newEntry },
            },
            { upsert: true, new: true }
        );

        res.json({ msg: 'Visit count updated', tracker });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
})

router.get('/', async (req, res) => {
    try {

        const trackData = await Track.find();

        res.json({ msg: 'Visit count updated', trackData });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
})

export default router;