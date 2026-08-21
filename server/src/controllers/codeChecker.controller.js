import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getUserGroqClient } from '../utils/aiClient.js';
import { STUDY_AI_IDENTITY } from '../utils/systemPrompt.js';

export const checkCode = asyncHandler(async (req, res) => {
    const { data } = req.body;
    const groq = await getUserGroqClient(req.user.id);

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `${STUDY_AI_IDENTITY}\n\n**Mode: Code Evaluator**\nYou are a precise code verification module for Student Hub. Evaluate whether the provided code solves the given problem and matches the expected output.\n\nProblem: ${data.question}\nSubmitted Code: ${data.code}\nExample Output: ${data.output}\n\nRespond ONLY with "true" if the logic is correct, or "false" if incorrect. Do not include any explanations.`,
            },
            {
                role: "user",
                content: "Evaluate code",
            },
        ],
        model: "openai/gpt-oss-20b",
    });

    const result = completion.choices[0]?.message?.content?.trim();
    res.status(200).json(new ApiResponse(200, result, "Success"));
});
