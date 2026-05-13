import express from "express";
import auth from '../middleware/auth.js';
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", auth, async (req, res) => {
    try {
        const { message } = req.body;
        console.log(message)
        //Ai result;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `${message}`,
                },
            ],
            model: "openai/gpt-oss-20b",
        });
        console.log(completion.choices[0]?.message?.content);

        const result=completion.choices[0]?.message?.content

        res.json(result);
    } catch (error) {
        console.log("Error",error)
    }
})

export default router