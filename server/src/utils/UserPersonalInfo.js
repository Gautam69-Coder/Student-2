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
    console.log("personalInfo extraction response:", response);

    let userPersonalInfo = null;
    if (response) {
        try {
            const cleaned = response.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleaned);
            userPersonalInfo = parsed?.personalInfo ?? null;
        } catch (err) {
            console.error("Failed to parse personalInfo JSON:", err.message);
        }
    }

    if (userPersonalInfo && typeof userPersonalInfo === 'string' && userPersonalInfo.toLowerCase() !== 'null' && userPersonalInfo.trim() !== '') {
        await UserMemory.findOneAndUpdate(
            { userId },
            {
                $push: {
                    personalInfo: {
                        $each: [userPersonalInfo.trim()]
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