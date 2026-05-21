import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    uid: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        // required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    },
    visitCount: {
        type: Number,
        default: 1
    },
    currentVisit: {
        type: Date
    },
    currentVisitTime: {
        type: String
    },
    lastVisitTime: {
        type: String
    },
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Practical'
        }
    ],
});

export default mongoose.model('User', UserSchema);
