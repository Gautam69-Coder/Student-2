import mongoose from "mongoose";

const ChatBotMemorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    conversationId: {
        type: String,
        required: true,
    },
    message: [
        {
            userPrompt: String,
            aiResponse: {
                type: String,
                default: "None "
            },
        }
    ],
},
    {
        timestamps: true,
    }
);

export default mongoose.model('ChatBotMemory', ChatBotMemorySchema);