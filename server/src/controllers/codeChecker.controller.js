import Groq from "groq-sdk";
import User from '../models/User.js';
import { decrypt } from '../utils/crypto.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const checkCode = asyncHandler(async (req, res) => {
    const { data } = req.body;
    console.log(data.question);
    console.log(data.output);

    const user = await User.findById(req.user.id);

    if (!user.apiKey && !user.iv) {
        throw new ApiError(400, "Please add your api key");
    }

    const apiKey = decrypt(
        user.apiKey,
        user.iv
    );
    const groq = new Groq({ apiKey: apiKey });

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a code checker, you will check the code and answer the question based on the code and output, here is ${data.question} or ${data.code} or this is only example output ${data.output} if the user logic is correct gave him true  . Give me only reponse in "true" or "false" not any explanation `,
            },
            {
                role: "user",
                content: `Check`,
            },
        ],
        model: "openai/gpt-oss-20b",
    });

    const result = completion.choices[0]?.message?.content;

    res.status(200).json(new ApiResponse(200, result, "Success"));
});
