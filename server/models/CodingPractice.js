import mongoose from 'mongoose';

const ExampleSchema = new mongoose.Schema(
    {
        input: {
            type: String,
            required: true
        },
        output: {
            type: String,
            required: true
        },
    },
    {
        _id: false,
    }
);

const ProblemSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },
        problemDiscription: {
            type: String,
            required: true
        },
        examples: [ExampleSchema],
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true
        },
        isCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const CodingPracticeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true

        },
        language: {
            type: String,
            required: true,
            trim: true
        },
        level: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            default: 'active',
        },

        isCompleted: {
            type: Boolean,
            default: false
        },

        totalProblems: {
            type: Number,
            default: 0,
        },

        problemList: [ProblemSchema]
    },
    { timestamps: true }
);

export default mongoose.model('CodingPractice', CodingPracticeSchema);


