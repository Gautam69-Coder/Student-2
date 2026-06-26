import express from "express";
import auth from '../middleware/auth.js';
import { handleAiCodeHelperChat } from '../controllers/aiCodeHelper.controller.js';

const router = express.Router();

router.post("/", auth, handleAiCodeHelperChat);

export default router;