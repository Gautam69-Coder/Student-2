import AICodeHelperMemory from "../models/AICodeHelperMemory.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sanitizeForPrompt } from '../utils/sanitize.js';
import { getUserGroqClient } from '../utils/aiClient.js';

export const handleAiAssistantChat = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const groq = await getUserGroqClient(req.user.id);
    const sanitizedMessage = sanitizeForPrompt(message);

    const memory = await AICodeHelperMemory.findOneAndUpdate(
        { userId: req.user.id },
        {
            $push: {
                messages: {
                    $each: [sanitizedMessage],
                    $slice: -10
                }
            },
        },
        { upsert: true, new: true }
    );

    const saveMemory = memory?.messages?.join("\n");

    // Ai result
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `you can also remember by previous messages then answer my next question: ${saveMemory}`,
            },
            {
                role: "user",
                content: sanitizedMessage,
            },
        ],
        model: "openai/gpt-oss-20b",
    });

    const result = completion.choices[0]?.message?.content;
    console.log("result:", sanitizedMessage);

    res.status(200).json(new ApiResponse(200, result, "Success"));
});
