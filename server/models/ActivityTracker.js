const mongoose = require('mongoose');


const TrackVisitSchema = new mongoose.Schema({
    visitCout: {
        type: String,
        required: true,
        default:'0'
    },
    date: {
        type: String,
        required: true,
        default: new Date().toLocaleDateString()
    },
    currentTime: {
        type: String,
        required: true,
        default: new Date().toLocaleTimeString()
    }
});

const ActivityTrackerSchema = new mongoose.Schema(
    {
        home: [
            {
                type: TrackVisitSchema,
                required: true
            }
        ],
        notes: [
            {
                type: TrackVisitSchema,
                required: true
            }
        ],
        practicals: [
            {
                type: TrackVisitSchema,
                required: true
            }
        ],
        community: [
            {
                type: TrackVisitSchema,
                required: true
            }
        ],
        feedback: [
            {
                type: TrackVisitSchema,
                required: true
            }
        ]
    }
)

module.exports = mongoose.model('ActivityTracker', ActivityTrackerSchema);