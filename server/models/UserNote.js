const mongoose = require('mongoose');

const UserNoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isGlobal: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('UserNote', UserNoteSchema);
