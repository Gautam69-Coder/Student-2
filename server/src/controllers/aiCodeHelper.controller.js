import Groq from "groq-sdk";
import { systemPrompt } from "../utils/systemPrompt.js";
import AIMemory from "../models/AICodeHelperMemory.js";
import { decrypt } from "../utils/crypto.js";
import User from "../models/User.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// BUG-15 fix: Sanitize user messages to reduce prompt injection risk
function sanitizeForPrompt(text) {
    if (typeof text !== 'string') return '';
    return text
        .replace(/\bsystem\s*:/gi, '[filtered]:')
        .replace(/\bignore\s+(all\s+)?previous\s+instructions?\b/gi, '[filtered]')
        .replace(/\byou\s+are\s+now\b/gi, '[filtered]')
        .replace(/\bnew\s+instructions?\s*:/gi, '[filtered]:');
}

export const handleAiCodeHelperChat = asyncHandler(async (req, res) => {
    const { context } = req.body;
    const userId = req.user.id;

    const user = await User.findById(req.user.id);
    if (!user.apiKey && !user.iv) {
        throw new ApiError(400, "Please add your api key");
    }
    const apiKey = decrypt(
        user.apiKey,
        user.iv
    );
    const groq = new Groq({ apiKey: apiKey });

    // Sanitize context message
    const sanitizedUserMessage = sanitizeForPrompt(context.message);

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

    const prompt = systemPrompt(sanitizedUserMessage, context.code, context.section, context.question);

    //Ai result;
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `you can also remember by previous messages then answer my next question: ${memory?.messages?.join("\n")} Here is the system prompt for you: ${prompt}`,
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
