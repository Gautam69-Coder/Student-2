import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sanitizeForPrompt } from '../utils/sanitize.js';
import { getUserGroqClient } from '../utils/aiClient.js';
import { getAiChatBotPrompt } from '../utils/systemPrompt.js';

export const handleAiChatBot = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const groq = await getUserGroqClient(req.user.id);
    const sanitizedMessage = sanitizeForPrompt(message);
    const systemPromptContent = getAiChatBotPrompt();

    // Ai result
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPromptContent,
            },
            {
                role: "user",
                content: sanitizedMessage,
            },
        ],
        model: "openai/gpt-oss-20b",
    });

    const result = completion.choices[0]?.message?.content;
    console.log("result:", result);

    res.status(200).json(new ApiResponse(200, result, "Success"));
});
