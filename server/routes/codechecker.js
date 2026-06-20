import express from 'express';
import auth from '../middleware/auth.js';
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
    try {
        const { data} = req.body ;
        console.log(data.question)
        console.log(data.output)

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a code checker, you will check the code and answer the question based on the code and output, here is ${data.question} or ${data.code} or exmaple output ${data.output} . Give me only reponse in "true" or "false" not any explanation `,
                },
                {
                    role: "user",
                    content: `Check`,
                },
            ],
            model: "openai/gpt-oss-20b",
        });

        const result = completion.choices[0]?.message?.content

        res.json(result);



        return res.json({
            result
        });
    } catch (err) {
        console.error('codechecker error:', err);
        return res.status(500).json({ ok: false, error: 'Internal Server Error' });
    }
});

export default router;

