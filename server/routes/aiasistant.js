import express from "express";
import auth from '../middleware/auth.js';
import Groq from "groq-sdk";
import AICodeHelperMemoery from "../models/AICodeHelperMemoery.js";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", auth, async (req, res) => {
    try {
        const { message } = req.body;

        const memory = await AICodeHelperMemoery.findOneAndUpdate(
            { userId: req.user.id },
            {
                $push: {
                    messages: {
                        $each: [message],
                        $slice: -10
                    }
                },
            },
            { upsert: true },
            { new: true }
        )

        const saveMemory = memory?.messages?.join("\n")

        //Ai result;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `you can also remember by previous messages then answer my next question: ${saveMemory}`,
                },
                {
                    role: "user",
                    content: `${message}`,
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