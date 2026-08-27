import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sanitizeForPrompt } from '../utils/sanitize.js';
import { getUserGroqClient } from '../utils/aiClient.js';
import { getAiChatBotPrompt } from '../utils/systemPrompt.js';
import ChatbotMemory from '../models/ChatbotMemory.js';

export const handleAiChatBot = asyncHandler(async (req, res) => {
    const {
        queryText,
        activeChatId,
        systemPrompt,
        attachedNotes = [],
        attachedPracticals = [],
        temperature = 0.7,
        maxTokens = 2048
    } = req.body.message || {};

    const groq = await getUserGroqClient(req.user.id);
    const userId = req.user.id;

    // OPTIMIZATION: Project only the last 15 messages of the conversation to keep payload and DB retrieval fast.
    const getConverstionMemory = await ChatbotMemory.findOne(
        { userId, conversationId: activeChatId },
        { message: { $slice: -15 } }
    );

    // Build the system prompt dynamically on the backend
    const systemPromptContent = getAiChatBotPrompt(systemPrompt, attachedNotes, attachedPracticals);

    // Structure the message payload using proper API roles

    // Invoke API client with the structured messages and dynamic parameters
    const completion = await groq.chat.completions.create({
        messages: [

            {
                role: "user",
                content: systemPromptContent
            },
            {
                role: "assistant",
                content: `this was the previouse conversation ${getConverstionMemory?.message} and this is the current query ${queryText}`
            }

        ],
        model: "openai/gpt-oss-20b",
        temperature: Number(temperature),
        max_tokens: Number(maxTokens)
    });

    const result = completion.choices[0]?.message?.content;

    // Update conversation memory with the new exchange
    await ChatbotMemory.findOneAndUpdate(
        { userId, conversationId: activeChatId },
        {
            $push: {
                message: {
                    $each: [
                        {
                            userPrompt: queryText,
                            aiResponse: result
                        }
                    ]
                }
            }
        },
        {
            upsert: true,
            new: true
        }
    );

    res.status(200).json(new ApiResponse(200, result, "Success"));
});
