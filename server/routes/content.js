const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');

// Get all content
router.get('/', async (req, res) => {
    try {
        const content = await Content.find().sort({ createdAt: -1 });
        res.json(content);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Content (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const { title, description, code, language, section, rating, likes, downloads } = req.body;
    try {
        const newContent = new Content({
            title, description, code, language, section, rating, likes, downloads
        });
        const content = await newContent.save();
        res.json(content);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Content
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    try {
        let content = await Content.findById(req.params.id);
        if (!content) return res.status(404).json({ msg: 'Content not found' });

        content = await Content.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(content);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete Content
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    try {
        let content = await Content.findById(req.params.id);
        if (!content) return res.status(404).json({ msg: 'Content not found' });

        await Content.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Content removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
