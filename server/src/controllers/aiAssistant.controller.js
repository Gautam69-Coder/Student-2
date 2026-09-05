import AICodeHelperMemory from "../models/AICodeHelperMemory.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sanitizeForPrompt } from '../utils/sanitize.js';
import { getUserGroqClient } from '../utils/aiClient.js';
import { getAiAssistantPrompt } from '../utils/systemPrompt.js';
import { UserPersonalInfo } from "../utils/UserPersonalInfo.js";

export const handleAiAssistantChat = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const groq = await getUserGroqClient(req.user.id);
    const sanitizedMessage = sanitizeForPrompt(message);

    const getUserPersonalInfo = await UserPersonalInfo(message, req.user.id);

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
    const systemPromptContent = getAiAssistantPrompt(saveMemory);

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPromptContent + `Give the user very simple answer and not more than 50 words.
                 ${getUserPersonalInfo} this is user personal info if you need this use it .     
                `,
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
