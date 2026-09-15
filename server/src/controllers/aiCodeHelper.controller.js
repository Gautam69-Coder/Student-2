import { systemPrompt } from "../utils/systemPrompt.js";
import AIMemory from "../models/AICodeHelperMemory.js";
import UserMemory from "../models/UserMemory.js";
import { UserPersonalInfo } from "../utils/UserPersonalInfo.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sanitizeForPrompt } from '../utils/sanitize.js';
import { getUserGroqClient } from '../utils/aiClient.js';

export const handleAiCodeHelperChat = asyncHandler(async (req, res) => {
    const { context } = req.body;
    const userId = req.user.id;

    // Sanitize context message
    const sanitizedUserMessage = sanitizeForPrompt(context.message);

    // Concurrently initialize client and retrieve memories (<30ms)
    const [groq, memory, userMemoryDoc] = await Promise.all([
        getUserGroqClient(userId),
        AIMemory.findOneAndUpdate(
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
        ),
        UserMemory.findOne({ userId }).lean()
    ]);

    // Fire background personal info extraction (non-blocking fire-and-forget)
    UserPersonalInfo(sanitizedUserMessage, userId, groq).catch((err) =>
        console.error("Background UserPersonalInfo error in CodeHelper:", err.message)
    );

    const memoryHistory = memory?.messages?.join("\n");
    const personalInfoText = userMemoryDoc?.personalInfo?.length
        ? userMemoryDoc.personalInfo.filter(Boolean).join("; ")
        : "";

    const prompt = systemPrompt(
        sanitizedUserMessage,
        context.code,
        context.section,
        context.question,
        memoryHistory,
        personalInfoText
    );

    // Groq AI result
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
        temperature: 0.6,
        max_tokens: 1800,
    });

    const result = completion.choices[0]?.message?.content;

    res.status(200).json(new ApiResponse(200, result, "Success"));
});

