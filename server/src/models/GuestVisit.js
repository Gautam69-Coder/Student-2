import mongoose from 'mongoose';

const GuestVisitSchema = new mongoose.Schema({
    section: {
        type: String,
        default: 'home'
    },
    visitDate: {
        type: String,
        required: true,
    },
    visitTime: {
        type: String,
        required: true,
    },
    device: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.model('GuestVisit', GuestVisitSchema);