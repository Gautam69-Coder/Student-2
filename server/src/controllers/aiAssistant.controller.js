import Groq from "groq-sdk";
import AICodeHelperMemory from "../models/AICodeHelperMemory.js";
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

export const handleAiAssistantChat = asyncHandler(async (req, res) => {
    const { message } = req.body;

    const user = await User.findById(req.user.id);
    if (!user.apiKey && !user.iv) {
        throw new ApiError(400, "Please add your api key");
    }

    const apiKey = decrypt(
        user.apiKey,
        user.iv
    );


    const groq = new Groq({ apiKey: apiKey });

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

    //Ai result;
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

    console.log("result:",sanitizedMessage)

    res.status(200).json(new ApiResponse(200, result, "Success"));
});
