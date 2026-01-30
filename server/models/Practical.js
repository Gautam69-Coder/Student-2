const mongoose = require('mongoose');

const PracticalSchema = new mongoose.Schema({
    practicalNumber: { type: String, required: true },
    section: { type: String, required: true },
    questions: [{
        question: { type: String, required: true },
        code: { type: String, required: true },
        fileData: { type: String },
        fileName: { type: String },
        fileType: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Practical', PracticalSchema);
