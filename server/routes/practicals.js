const express = require('express');
const router = express.Router();
const Practical = require('../models/Practical');
const auth = require('../middleware/auth');

// Get all practicals
router.get('/', async (req, res) => {
    try {
        const practicals = await Practical.find().collation({ locale: "en", numericOrdering: true }).sort({ practicalNumber: -1 });
        res.json(practicals);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create a practical
router.post('/', auth, async (req, res) => {
    const { practicalNumber, section, questions } = req.body;
    try {
        const newPractical = new Practical({
            practicalNumber,
            section,
            questions
        });
        const practical = await newPractical.save();
        res.json(practical);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a practical
router.put('/:id', auth, async (req, res) => {
    const { practicalNumber, section, questions } = req.body;
    try {
        let practical = await Practical.findById(req.params.id);
        if (!practical) return res.status(404).json({ msg: 'Practical not found' });

        practical.practicalNumber = practicalNumber;
        practical.section = section;
        practical.questions = questions;

        await practical.save();
        res.json(practical);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a practical
router.delete('/:id', auth, async (req, res) => {
    try {
        await Practical.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Practical deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
