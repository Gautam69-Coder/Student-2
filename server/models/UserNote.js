const mongoose = require('mongoose');

const UserNoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String },
    section: { type: String, default: 'General' },
    fileName: { type: String },
    fileType: { type: String },
    fileData: { type: String }, // Base64 or URL
    isGlobal: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('UserNote', UserNoteSchema);
