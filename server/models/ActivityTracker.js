const mongoose = require('mongoose');


const TrackVisitSchema = new mongoose.Schema({
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
        username: {
            type: String,
            require: true,
        },
        home: {
            visitCount: {
                type: Number,
                default: '0'
            },
            // history: [
            //     {
            //         type: TrackVisitSchema,
            //     }
            // ],
        },
        notes: {
            visitCount: {
                type: Number,
                default: '0'
            },
            // history: [
            //     {
            //         type: TrackVisitSchema,
            //     }
            // ],
        },

        practicals: {
            visitCount: {
                type: Number,
                default: '0'
            },
            // history: [
            //     {
            //         type: TrackVisitSchema,
            //     }
            // ],
        },
        community: {
            visitCount: {
                type: Number,
                default: '0'
            },
            // history: [
            //     {
            //         type: TrackVisitSchema,
            //     }
            // ],
        },
        feedback: {
            visitCount: {
                type: Number,
                default: 0,
            },
            // history: [
            //     {
            //         type: TrackVisitSchema,
            //     }
            // ],
        },
        aboutcontact: {
            visitCount: {
                type: Number,
                default: 0,
            },
            // history: [
            //     {
            //         type: TrackVisitSchema,
            //     }
            // ],
        },
    }
)

module.exports = mongoose.model('ActivityTracker', ActivityTrackerSchema);