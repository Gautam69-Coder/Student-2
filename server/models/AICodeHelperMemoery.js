import mongoose from "mongoose";

const aiMemorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: {
        type: [String],
        default: [],
        required : true,
    },
    section: {
        type: String,
        default: "None"
    },
    question: {
        type: String,
        default: "None"
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model("AIMemory", aiMemorySchema);