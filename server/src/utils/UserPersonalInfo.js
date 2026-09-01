import { getUserGroqClient } from '../utils/aiClient.js';
import UserMemory from '../models/UserMemory.js';

export const UserPersonalInfo = async (message, userId) => {
    const groq = await getUserGroqClient(userId);

    const completion = await groq.chat.completions.create({
        messages: [

            {
                role: "user",
                content: `

Current user query: ${message}

If the user shares personal information (name, preferences, ongoing projects — NOT sensitive data like health, financial, or ID details), extract it separately.

Respond ONLY with valid JSON in this exact shape, no markdown fences, no extra text:
{
  "personalInfo": "if user have personal information use this <add maximum of 10 words expalation where they can understand the user info> insttead of give null <extracted personal info, or null if none>",
}`
            }

        ],
        model: "openai/gpt-oss-20b",
    });

    const response = completion.choices[0]?.message?.content;
    console.log(response);

    const userPersonalInfo = JSON.parse(response).personalInfo

    if (userPersonalInfo !== null) {
        await UserMemory.findOneAndUpdate(
            { userId },
            {
                $push: {
                    personalInfo: {
                        $each: [userPersonalInfo]
                    }
                }
            },
            {
                upsert: true,
                new: true
            }
        );
    }


    const getUserPersonalInfo = await UserMemory.findOne({ userId });
    return getUserPersonalInfo;
}