import mongoose from 'mongoose';

const UserNoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: "NAN"
    },
    section: {
        type: String,
        default: 'General'
    },
    fileName: {
        type: String,
        default: "NAN"
    },
    fileType: {
        type: String,
        default: "NAN"
    },
    fileData: {
        type: String,
        default: "NAN"
    },
    isGlobal: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('UserNote', UserNoteSchema);
