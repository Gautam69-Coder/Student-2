import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getUserGroqClient } from '../utils/aiClient.js';
import { getAiChatBotPrompt } from '../utils/systemPrompt.js';
import ChatbotMemory from '../models/ChatbotMemory.js';
import { UserPersonalInfo } from '../utils/UserPersonalInfo.js';
import { ApiError } from '../utils/ApiError.js';

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

    const userId = req.user.id;
    const groq = await getUserGroqClient(userId);

    const getUserPersonalInfo = await UserPersonalInfo(queryText, userId);

    const getConversationMemory = await ChatbotMemory.findOne(
        { userId, conversationId: activeChatId },
        { message: { $slice: -15 } }
    );


    const systemPromptContent = getAiChatBotPrompt(systemPrompt, attachedNotes, attachedPracticals);


    const completion = await groq.chat.completions.create({
        messages: [

            {
                role: "user",
                content: systemPromptContent
            },
            {
                role: "assistant",
                content: `You are an assistant with memory. 
            ${getUserPersonalInfo} this is user personal info if you need this use it .
Previous conversation summary: ${getConversationMemory?.message || "None"}

Current user query: ${queryText}`
            }

        ],
        model: "openai/gpt-oss-20b",
        temperature: Number(temperature),
        max_tokens: Number(maxTokens)
    });

    const result = completion.choices[0]?.message?.content;

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

export const deleteConversation = asyncHandler(async (req, res) => {
   
    const { deleteId } = req.body;
    
    if (!deleteId) {
        throw new ApiError(400, "Delete Id is required");
    }

    const deleteData = await ChatbotMemory.findOneAndDelete(
        { conversationId: deleteId },
        { returnDocument: 'after' }
    );

    console.log(deleteData);

    res.status(200).json(new ApiResponse(200, deleteData , "Conversation delete SuccessFully"))
})