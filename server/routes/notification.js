const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');


router.post('/', auth, async (req, res) => {
    try {
        const { title, message } = req.body;

        console.log(title)
        console.log(message)

        const notification = new Notification({
            userId: req.user.id,
            title,
            message
        });
        await notification.save();

        return res.json(notification);

    } catch (err) {
        console.error("Error sending notification:", err);
    }
});

router.get('/', async(req, res) => {
    try {

        const getNotification = await Notification.find();
        return res.json(getNotification);
    }
    catch (err) {
        console.error("Error geting notification:", err);
    }
})

module.exports = router;