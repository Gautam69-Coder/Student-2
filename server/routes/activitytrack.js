const express = require("express");
const router = express.Router();
// const auth = require('../middleware/auth');
const Track = require("../models/ActivityTracker")

router.post('/', async (req, res) => {
    const { count } = req.body;

    const incCount = count + 1;

    const ActivityTracker=new Track({
        home: [
            {
                visitCout: incCount.toString(),
                date: new Date().toLocaleDateString(),
                currentTime: new Date().toLocaleTimeString()
            }
        ],
   })

   ActivityTracker.save();

   console.log(ActivityTracker);

   res.json({ msg: 'Visit count updated', ActivityTracker });
})

module.exports = router;