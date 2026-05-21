import express from "express";
import auth from '../middleware/auth.js';
import Groq from "groq-sdk";
import { systemPrompt } from "../utils/systemprompt.js";
import AIMemory from "../models/AICodeHelperMemoery.js";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", auth, async (req, res) => {
    try {
        const { context } = req.body;
        const userId = req.user.id;
        // console.log(req.user)

        const memory = await AIMemory.findOneAndUpdate(
            { userId },
            {
                $push: {
                    messages: {
                        $each : [context.message],
                        $slice : -10
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