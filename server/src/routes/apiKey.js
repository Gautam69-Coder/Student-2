import express from "express"
import { encrypt } from "../utils/crypto.js"
import User from "../models/User.js"
import auth from "../middleware/auth.js"

const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const { data } = req.body;
        const userId = req.user.id;

        if (!data.apiKeyInput) {
            return res.json({ error: "Api key is undefined" })
        }

        const encrypted = encrypt(data.apiKeyInput);

        const saveApiKey = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    apiKey: encrypted.encryptedData,
                    iv: encrypted.iv
                }
            },
            { upsert: true },
            { new: true }
        );
        res.json({
            message: "Api key safely Save"
        })
    }
    catch (error) {
        console.error(error);
        res.json(error);
    }
})

export default router