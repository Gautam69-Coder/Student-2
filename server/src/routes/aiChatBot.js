import express from "express";
import auth from '../middleware/auth.js';
import { handleAiChatBot } from '../controllers/aiChatBot.controller.js';

const router = express.Router();

router.post("/", auth, handleAiChatBot);

export default router;