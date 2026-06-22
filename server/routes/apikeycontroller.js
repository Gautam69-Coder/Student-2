import express from "express"
import { encrypt } from "../utils/crypto.js"
import User from "../models/User.js"
import auth from "../middleware/auth.js"

const router = express.Router();

router.post("/save-api", auth, (req, res) => {
    try {
        const { apiKey } = req.body;
        const userId = req.user.id;

        if (!apiKey) {
            return res.json({ error: "Api key is undefined" })
        }

        const encrypted = encrypt(apiKey);

        const saveApiKey = await User.findByOneAndUpdate(
            { userId },
            {
                $set: { apiKey }
            },
            { upsert: true },
            { new: true }
        );
    }
    catch (error) {
        console.error(error);
        res.json(error);
    }
})

export default router