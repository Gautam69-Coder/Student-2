import express from 'express';
import Practical from '../models/Practical.js';
import GuestVisit from '../models/GuestVisit.js';

const router = express.Router();

// Returns dashboard stats for user view
router.get('/dashboard', async (req, res) => {
    try {
        const [totalPracticals, activePracticesCount, activeSubjectSections, platformVisitsCount] =
            await Promise.all([
                Practical.countDocuments(),
                // No explicit "active" field exists in the current Practical schema.
                // Treat all practicals as active.
                Practical.countDocuments(),
                Practical.distinct('section'),
                GuestVisit.countDocuments(),
            ]);

        res.json({
            activePractices: activePracticesCount,
            activePracticalSubjectsCount: activeSubjectSections.length,
            totalPracticals,
            platformVisits: platformVisitsCount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

export default router;

