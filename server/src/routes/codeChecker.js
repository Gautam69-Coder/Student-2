import express from 'express';
import auth from '../middleware/auth.js';
import { checkCode } from '../controllers/codeChecker.controller.js';

const router = express.Router();

router.post('/', auth, checkCode);

export default router;
