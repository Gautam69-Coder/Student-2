import express from 'express';
import CodingPractice from '../models/CodingPractice.js';

const router = express.Router();

// Get all coding practice tracks
router.get('/', async (req, res) => {
    try {
        const tracks = await CodingPractice.find().sort({ createdAt: -1 });
        // console.log('Fetched Coding Practices:', tracks);
        // await CodingPractice.deleteMany({});
        // await CodingPractice.insertMany(tracks);
        res.json(tracks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});


export default router;

