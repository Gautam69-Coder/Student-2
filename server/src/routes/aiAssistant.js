import express from "express";
import auth from '../middleware/auth.js';
import Groq from "groq-sdk";
import AICodeHelperMemory from "../models/AICodeHelperMemory.js";
import { decrypt } from "../utils/crypto.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const { message } = req.body;

        const user = await User.findById(req.user.id);
        if (!user.apiKey && !user.iv) {
            return res.json({ message: "Please add your api key" })
        }

        const apiKey = decrypt(
            user.apiKey,
            user.iv
        );

        const groq = new Groq({ apiKey: apiKey });

        const memory = await AICodeHelperMemory.findOneAndUpdate(
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
        res.status(500).json(error)
    }
})

export default router