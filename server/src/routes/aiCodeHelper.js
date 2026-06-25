import express from "express";
import auth from '../middleware/auth.js';
import Groq from "groq-sdk";
import { systemPrompt } from "../utils/systemPrompt.js";
import AIMemory from "../models/AICodeHelperMemory.js";
import { decrypt } from "../utils/crypto.js";
import User from "../models/User.js";

const router = express.Router();


router.post("/", auth, async (req, res) => {
    try {
        const { context } = req.body;
        const userId = req.user.id;

        const user = await User.findById(req.user.id);
        if (!user.apiKey && !user.iv) {
            return res.json({ message: "Please add your api key" })
        }
        const apiKey = decrypt(
            user.apiKey,
            user.iv
        );
        const groq = new Groq({ apiKey: apiKey });
        // console.log(req.user)

        const memory = await AIMemory.findOneAndUpdate(
            { userId },
            {
                $push: {
                    messages: {
                        $each: [context.message],
                        $slice: -10
                    }
                },
                question: context.question,
                section: context.section,
            },
            { upsert: true },
            { new: true }
        );

        const prompt = systemPrompt(context.message, context.code, context.section, context.question);

        //Ai result;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `you can also remember by previous messages then answer my next question: ${memory?.messages?.join("\n")} Here is the system prompt for you: ${prompt}`,
                },
                {
                    role: "user",
                    content: `${context.message}`,
                },
            ],
            model: "openai/gpt-oss-20b",
        });

        const result = completion.choices[0]?.message?.content

        res.json(result);
    } catch (error) {
        console.log("Error", error)
    }
})

export default router