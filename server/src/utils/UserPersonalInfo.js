import { getUserGroqClient } from '../utils/aiClient.js';
import UserMemory from '../models/UserMemory.js';

// Fast heuristic to avoid calling LLM when message has zero personal indicators
const PERSONAL_INFO_HEURISTIC_REGEX = /\b(my name|i am|i'm|call me|i study|my college|my school|my project|i live|i prefer|my favorite|i like to|i work as|i usually|my hobby|my interest|i specialize)\b/i;

export const UserPersonalInfo = async (message, userId, existingGroqClient = null) => {
    try {
        if (!message || typeof message !== 'string') return null;

        // Quick heuristic check: if no indicators of personal info, skip LLM extraction completely
        if (!PERSONAL_INFO_HEURISTIC_REGEX.test(message)) {
            return null;
        }

        const groq = existingGroqClient || await getUserGroqClient(userId);

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Current user query: ${message}

If the user shares personal information (name, preferences, ongoing projects — NOT sensitive data like health, financial, or ID details), extract it separately.

Respond ONLY with valid JSON in this exact shape, no markdown fences, no extra text:
{
  "personalInfo": "<maximum 10 words summary of user info, or null if none>"
}`
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.1,
            max_tokens: 80,
        });

        const response = completion.choices[0]?.message?.content;

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

        if (
            userPersonalInfo &&
            typeof userPersonalInfo === 'string' &&
            userPersonalInfo.toLowerCase() !== 'null' &&
            userPersonalInfo.trim() !== '' &&
            !userPersonalInfo.toLowerCase().includes("maximum 10 words")
        ) {
            await UserMemory.findOneAndUpdate(
                { userId },
                {
                    $push: {
                        personalInfo: {
                            $each: [userPersonalInfo.trim()],
                            $slice: -20
                        }
                    }
                },
                {
                    upsert: true,
                    new: true
                }
            );
        }

        return userPersonalInfo;
    } catch (err) {
        console.error("Error in UserPersonalInfo background extraction:", err.message);
        return null;
    }
};