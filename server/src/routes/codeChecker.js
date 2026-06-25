import express from 'express';
import auth from '../middleware/auth.js';
import Groq from "groq-sdk";
import User from '../models/User.js';
import { decrypt } from '../utils/crypto.js';

const router = express.Router();


router.post('/',auth, async (req, res) => {
    try {
        const { data } = req.body;
        console.log(data.question)
        console.log(data.output)

        const user = await User.findById(req.user.id);

        if (!user.apiKey && !user.iv) {
            return res.json({ message: "Please add your api key" })
        }

        const apiKey = decrypt(
            user.apiKey,
            user.iv
        );
        const groq = new Groq({ apiKey: apiKey });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a code checker, you will check the code and answer the question based on the code and output, here is ${data.question} or ${data.code} or this is only example output ${data.output} if the user logic is correct gave him true  . Give me only reponse in "true" or "false" not any explanation `,
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

