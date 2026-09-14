import AICodeHelperMemory from "../models/AICodeHelperMemory.js";
import UserMemory from "../models/UserMemory.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sanitizeForPrompt } from '../utils/sanitize.js';
import { getUserGroqClient } from '../utils/aiClient.js';
import { getAiAssistantPrompt } from '../utils/systemPrompt.js';
import { UserPersonalInfo } from "../utils/UserPersonalInfo.js";

export const handleAiAssistantChat = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;
    const sanitizedMessage = sanitizeForPrompt(message);

    // Initialize Groq client and fetch memories concurrently (<30ms)
    const [groq, memory, userMemoryDoc] = await Promise.all([
        getUserGroqClient(userId),
        AICodeHelperMemory.findOneAndUpdate(
            { userId },
            {
                $push: {
                    messages: {
                        $each: [sanitizedMessage],
                        $slice: -10
                    }
                },
            },
            { upsert: true, new: true }
        ),
        UserMemory.findOne({ userId }).lean()
    ]);

    // Fire background personal info extraction (non-blocking fire-and-forget)
    UserPersonalInfo(sanitizedMessage, userId, groq).catch((err) =>
        console.error("Background UserPersonalInfo error:", err.message)
    );

    const saveMemory = memory?.messages?.join("\n");
    const systemPromptContent = getAiAssistantPrompt(saveMemory);

    const personalInfoText = userMemoryDoc?.personalInfo?.length
        ? userMemoryDoc.personalInfo.filter(Boolean).join("; ")
        : "";

    let systemMessage = systemPromptContent;
    if (personalInfoText) {
        systemMessage += `\n\n**Known User Info:**\n${personalInfoText}`;
    }

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemMessage,
            },
            {
                role: "user",
                content: sanitizedMessage,
            },
        ],
        model: "openai/gpt-oss-20b",
        temperature: 0.7,
        max_tokens: 1500,
    });

    const result = completion.choices[0]?.message?.content;
    res.status(200).json(new ApiResponse(200, result, "Success"));
});

