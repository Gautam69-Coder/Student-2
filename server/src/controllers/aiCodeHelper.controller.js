import { systemPrompt } from "../utils/systemPrompt.js";
import AIMemory from "../models/AICodeHelperMemory.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sanitizeForPrompt } from '../utils/sanitize.js';
import { getUserGroqClient } from '../utils/aiClient.js';

export const handleAiCodeHelperChat = asyncHandler(async (req, res) => {
    const { context } = req.body;
    const userId = req.user.id;

    const groq = await getUserGroqClient(userId);
    // Sanitize context message
    const sanitizedUserMessage = sanitizeForPrompt(context.message);
    console.log(`Sanitized user message: ${sanitizedUserMessage}`);

    const memory = await AIMemory.findOneAndUpdate(
        { userId },
        {
            $push: {
                messages: {
                    $each: [sanitizedUserMessage],
                    $slice: -10
                }
            },
            question: context.question,
            section: context.section,
        },
        { upsert: true, new: true }
    );

    const memoryHistory = memory?.messages?.join("\n");
    const prompt = systemPrompt(sanitizedUserMessage, context.code, context.section, context.question, memoryHistory);

    // Ai result
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: prompt,
            },
            {
                role: "user",
                content: sanitizedUserMessage,
            },
        ],
        model: "openai/gpt-oss-20b",
    });

    const result = completion.choices[0]?.message?.content;

    res.status(200).json(new ApiResponse(200, result, "Success"));
});
