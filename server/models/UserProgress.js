import mongoose, { Schema } from "mongoose";

const userProgressSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        codingLanguage: {
            type: String,
            required: true
        },
        totalProblems: {
            type: Number,
            default: 0,
        },
        day: {
            type: String,
            default: "Monday",
        },
        completedProblems: [
            {
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        isCompleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps : true
    }
);

export default mongoose.model("UserProgress",userProgressSchema);