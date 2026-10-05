import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getUserGroqClient } from '../utils/aiClient.js';
import { ApiError } from '../utils/ApiError.js';

export const handleImproveNote = asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    const userId = req.user.id;

    
    if (!prompt || prompt === "" || prompt === null) {
        throw new ApiError(400, "Prompt is required");
    }
    
    const groq = await getUserGroqClient(userId);

    console.log("Prmpt : ",prompt);

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Dont give me extra info like tips,notes etc you are just improver only note.
                 Execute only prompt then give reponse to the user.
                 Give me every time whole note 
                 `,
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "openai/gpt-oss-20b",
        temperature: 0.6,
        max_tokens: 1800,
    });
    
    const result = completion.choices[0]?.message?.content;
    

    res.status(200).json(new ApiResponse(200, result, "Success"));
})