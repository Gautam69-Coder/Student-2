import mongoose from 'mongoose';

const PracticalSchema = new mongoose.Schema({
    practicalNumber: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    questions: [
        {
            question: {
                type: String,
                required: true
            },
            // code: {
            //     type: String,
            //     required: true
            // },
            code: [
                {
                    languageName: {
                        type: String,
                        required: true,
                    },
                    code: {
                        type: String,
                        required: true
                    },
                }
            ],
            fileUrl: {
                type: String,
                default: null
            },
            filePublicId: {
                type: String,
                default: null
            },
            fileData: {
                type: String,
                default: null
            },
            fileName: {
                type: String,
                default: null
            },
            fileType: {
                type: String,
                default: null
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model('Practical', PracticalSchema);
