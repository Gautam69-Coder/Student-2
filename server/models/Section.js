import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

export default mongoose.model('Section', SectionSchema);
