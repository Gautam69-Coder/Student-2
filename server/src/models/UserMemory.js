import mongoose from "mongoose";

const UserMemorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    personalInfo: [
        {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    ],

},
    { timestamps: true }
);

export default mongoose.model("UserMemory", UserMemorySchema)