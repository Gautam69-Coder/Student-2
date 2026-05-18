import express from "express";
import auth from '../middleware/auth.js';
import Groq from "groq-sdk";
import { systemPrompt } from "../utils/systemprompt.js"; 

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


let saveMemory = []

router.post("/", auth, async (req, res) => {
    try {
        const {context} = req.body;
        saveMemory.push(context.message);

        const prompt = systemPrompt(context.message, context.code,context.section,context.question);
        
        //Ai result;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `you can also remember by previous messages then answer my next question: ${saveMemory} Here is the system prompt for you: ${prompt}`,    
                },
                {
                    role: "user",
                    content: `${context.message}`,
                },
            ],
            model: "openai/gpt-oss-20b",
        });

        const result=completion.choices[0]?.message?.content

        res.json(result);
    } catch (error) {
        console.log("Error",error)
    }
})

export default router