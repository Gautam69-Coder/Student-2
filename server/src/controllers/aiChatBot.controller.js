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


    const personalInfoText = getUserPersonalInfo?.personalInfo?.length
        ? getUserPersonalInfo.personalInfo.filter(Boolean).join("; ")
        : "";

    let conversationHistory = "";
    if (getConversationMemory?.message && Array.isArray(getConversationMemory.message)) {
        conversationHistory = getConversationMemory.message
            .filter(m => m.userPrompt || m.aiResponse)
            .map(m => `User: ${m.userPrompt}\nSiara: ${m.aiResponse}`)
            .join("\n\n");
    }

    let systemMessage = systemPromptContent;
    if (personalInfoText) {
        systemMessage += `\n\n**Known User Info:**\n${personalInfoText}`;
    }
    if (conversationHistory) {
        systemMessage += `\n\n**Recent Conversation Context:**\n${conversationHistory}`;
    }

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemMessage
            },
            {
                role: "user",
                content: queryText
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