import express from "express";
import auth from '../middleware/auth.js';
import { handleAiAssistantChat } from '../controllers/aiAssistant.controller.js';

const router = express.Router();

router.post("/", auth, handleAiAssistantChat);

export default router;