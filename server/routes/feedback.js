const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/feedback
// @desc    Submit feedback
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, message, category } = req.body;
    try {
        const newFeedback = new Feedback({
            userId: req.user.id,
            title,
            message,
            category
        });

        const feedback = await newFeedback.save();
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/feedback
// @desc    Get all feedback (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!['admin', 'superadmin'].includes(user.role)) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const feedbacks = await Feedback.find().populate('userId', 'username email').sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/feedback/:id
// @desc    Update feedback status
// @access  Private
router.patch('/:id', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!['admin', 'superadmin'].includes(user.role)) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        let feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ msg: 'Feedback not found' });

        feedback.status = status;
        await feedback.save();

        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
