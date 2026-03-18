const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const Track = require("../models/ActivityTracker")
const User = require("../models/User")

router.post('/', auth, async (req, res) => {
    try {
        const { section } = req.body;
        const userId = req.user.id;

        const validSections = ['home', 'notes', 'practicals', 'community', 'feedback'];

        if (!validSections.includes(section)) {
            return res.status(400).json({ msg: 'Invalid section' });
        }

        const newEntry = {
            date: new Date().toLocaleDateString(),
            currentTime: new Date().toLocaleTimeString()
        };

        const userName = await User.findById(userId)

        const tracker = await Track.findOneAndUpdate(
            {},
            {
                $inc: { [`${section}.visitCount`]: 1 },
                $set: { username: userName.username},
                $push: { [`${section}.history`]: newEntry },
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
        
        const trackData=await Track.find();
        console.log(trackData);

        res.json({ msg: 'Visit count updated', trackData });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
})

module.exports = router;