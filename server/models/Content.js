const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    code: { type: String, required: true },
    language: { type: String, default: 'text' },
    section: { type: String, required: true }, // DSA, JAVA, Scratch
    rating: { type: Number, default: 3 },
    likes: { type: Number, default: 3 },
    downloads: { type: String }, // URL or path
    icon: { type: String } // URL to icon/preview image
}, { timestamps: true });

module.exports = mongoose.model('Content', ContentSchema);
