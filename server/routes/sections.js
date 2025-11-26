const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const auth = require('../middleware/auth');

// Get all sections
router.get('/', async (req, res) => {
    try {
        const sections = await Section.find();
        res.json(sections);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Section (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const { name } = req.body;
    try {
        const newSection = new Section({ name });
        const section = await newSection.save();
        res.json(section);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete Section (Admin only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    try {
        await Section.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Section removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
