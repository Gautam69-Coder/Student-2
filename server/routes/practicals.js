import express from 'express';
import auth from '../middleware/auth.js';
import Practical from '../models/Practical.js';
import uploadMulter from '../middleware/multer.js';
import { uploadCloudinary } from '../utils/uploadcloudinary.js';

const router = express.Router();

// Get all practicals
router.get('/', async (req, res) => {
    try {
        const practicals = await Practical.find().collation({ locale: "en", numericOrdering: true });
        res.json(practicals);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create a practical
router.post('/', auth, uploadMulter.array("files"), async (req, res) => {
    try {
        const { practicalNumber, section } = req.body;

        let questions = req.body.questions;
        questions = JSON.parse(questions);

        const files = req.files || [];

        // Upload each file to Cloudinary and map result back to questions
        // req.body carries a `fileIndexMap` array (JSON) that tells which question index each file belongs to
        let fileIndexMap = req.body.fileIndexMap ? JSON.parse(req.body.fileIndexMap) : [];

        // Upload all files to Cloudinary in parallel
        const uploadedFiles = await Promise.all(
            files.map(file => uploadCloudinary(file.path))
        );

        // Attach Cloudinary URLs to the correct question by index
        fileIndexMap.forEach((questionIndex, fileArrayIndex) => {
            const uploaded = uploadedFiles[fileArrayIndex];
            if (uploaded) {
                questions[questionIndex].fileUrl = uploaded.secure_url;
                questions[questionIndex].filePublicId = uploaded.public_id;
                console.log(`Question ${questionIndex} File:`, uploaded.secure_url);
            }
        });

        console.log("Full Questions with Cloudinary URLs:", JSON.stringify(questions, null, 2));

        const newPractical = new Practical({
            practicalNumber,
            section,
            questions
        });

        const practical = await newPractical.save();
        res.json({ msg: "Practical Created Successfully", success: true, data: practical });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a practical
router.put('/:id', auth, uploadMulter.array("files"), async (req, res) => {
    try {
        const { practicalNumber, section } = req.body;
        let questions = JSON.parse(req.body.questions);
        const files = req.files || [];
        let fileIndexMap = req.body.fileIndexMap ? JSON.parse(req.body.fileIndexMap) : [];

        let practical = await Practical.findById(req.params.id);
        if (!practical) return res.status(404).json({ msg: 'Practical not found' });

        // Handle new file uploads
        if (files.length > 0) {
            const uploadedFiles = await Promise.all(
                files.map(file => uploadCloudinary(file.path))
            );

            fileIndexMap.forEach((questionIndex, fileArrayIndex) => {
                const uploaded = uploadedFiles[fileArrayIndex];
                if (uploaded) {
                    // Update specific question with new file info
                    questions[questionIndex].fileUrl = uploaded.secure_url;
                    questions[questionIndex].filePublicId = uploaded.public_id;
                }
            });
        }

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

export default router;
