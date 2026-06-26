import express from "express"
import auth from "../middleware/auth.js"
import { saveApiKey } from '../controllers/apiKey.controller.js';

const router = express.Router();

router.post("/", auth, saveApiKey);

export default router;