import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { generalLimiter, authLimiter, aiLimiter } from './middleware/rateLimiter.js';

// Routes imports
import auth from './routes/auth.js';
import content from './routes/content.js';
import notes from './routes/notes.js';
import sections from './routes/sections.js';
import practicals from './routes/practicals.js';
import feedback from './routes/feedback.js';
import notification from './routes/notification.js';
import community from './routes/community.js';
import aiassistant from './routes/aiAssistant.js';
import aicodehelper from "./routes/aiCodeHelper.js";
import codingPractices from './routes/codingPractices.js';
import stats from './routes/stats.js';
import codechecker from './routes/codeChecker.js';
import activityTrack from './routes/activityTrack.js';
import guestTrack from './routes/guestTrack.js';
import apiKeyController from "./routes/apiKey.js";

const app = express();

// Trust the first proxy hop (necessary for rate limiting behind load balancers like Render/Nginx)
app.set('trust proxy', 1);

// Standard Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5001', 'http://127.0.0.1:5173', 'https://student-2-3ow8.onrender.com', 'https://student-2.pages.dev', 'https://student-2-temprory.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
    credentials: true
}));

app.use(cookieParser());
// BUG-14 fix: Reduce body size limits from 100mb to prevent memory exhaustion DoS
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.text({ limit: '1mb' }));

// BUG-13 fix: Apply global rate limiter
app.use(generalLimiter);

// API Routes mounting — with targeted rate limiters
app.use('/api/auth', authLimiter, auth);
app.use('/api/content', content);
app.use('/api/notes', notes);
app.use('/api/sections', sections);
app.use('/api/practicals', practicals);
app.use('/api/feedback', feedback);
app.use('/api/notifications', notification);
app.use('/api/community', community);
app.use('/api/aiassistant', aiLimiter, aiassistant);
app.use('/api/aicodehelper', aiLimiter, aicodehelper);
app.use('/api/coding-practices', codingPractices);
app.use('/api/stats', stats);
app.use('/api/code-checker', aiLimiter, codechecker);
app.use('/api/hometracking', activityTrack);
app.use('/api/trackingData', activityTrack);
app.use('/api/guesttrack', guestTrack);
app.use('/api/save-apikey', apiKeyController);

// Root route
app.get('/', (req, res) => {
    res.send('API is running with Socket.io...');
});

export default app;
