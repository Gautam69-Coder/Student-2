import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';


import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import User from './models/User.js';


const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://student-2-3ow8.onrender.com', 'https://student-2.pages.dev', 'https://student-2-temprory.onrender.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    }
});

// Socket.io Presence Tracking
import { time } from 'console';

// Presence Tracking
const onlineUsers = new Set();
const userMap = new Map(); // socket.id -> { userId, username }

io.on('connection', (socket) => {
    // console.log('🔌 New connection attempt:', socket.id);

    socket.on('user_online', async (userData) => {
        if (userData && userData.id) {
            const userId = String(userData.id);
            onlineUsers.add(userId);
            userMap.set(socket.id, { ...userData, id: userId });

            // console.log(`👤 User Registered: ${userData.username} [ID: ${userId}]`);

            try {
                // Increment visit count in database
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        $inc: { visitCount: 1 },
                        currentVisit: new Date(),
                        currentVisitTime: new Date().toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: 'Asia/Kolkata',
                        })
                    },
                    { new: true }
                );

                // console.log(`📈 Visit count updated for ${userData.username}: ${updatedUser?.lastVisitTime}`);
                // console.log(`📈 Visit count updated for ${userData.username}: ${updatedUser?.currentVisitTime}`);

                // Broadcast update so admin table sees new visit count
                io.emit('user_stats_update', {
                    userId: userId,
                    visitCount: updatedUser?.visitCount,
                    currentVisit: updatedUser?.currentVisit,
                    currentVisitTime: updatedUser?.currentVisitTime
                });
            } catch (err) {
                console.error('❌ Error updating visit count:', err.message);
            }

            // console.log(`📊 Total Unique Online: ${onlineUsers.size}`);

            io.emit('online_users_update', Array.from(onlineUsers));
            io.emit('user_visit', { ...userData, timestamp: new Date() });
        } else {
            console.log('⚠️ Received invalid user_online data:', userData);
        }
    });

    socket.on('user_logout', async () => {
        const userData = userMap.get(socket.id);
        if (userData) {
            console.log(`📤 User Logged Out: ${userData.username}`);
            userMap.delete(socket.id);

            // Check if user has other tabs open
            const stillOnline = Array.from(userMap.values()).some(u => String(u.id) === String(userData.id));
            if (!stillOnline) {
                onlineUsers.delete(String(userData.id));
                console.log(`📉 User removed from online list: ${userData.username}`);
                io.emit('online_users_update', Array.from(onlineUsers));
            }
        }
    });

    socket.on('disconnect', async () => {
        const userData = userMap.get(socket.id);
        if (userData) {
            // console.log(`👋 Socket Disconnected: ${userData.username} (${socket.id})`);
            userMap.delete(socket.id);

            const userId = String(userData.id);


            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $inc: { visitCount: 1 },
                    lastVisit: new Date(),
                    lastVisitTime: new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                        timeZone: 'Asia/Kolkata',
                    })
                },
                { new: true }
            );

            console.log(`📈 Disconnect ${userData.username}: ${updatedUser?.lastVisitTime}`);


            updatedUser.save();

            // Check if user has other tabs open
            const stillOnline = Array.from(userMap.values()).some(u => String(u.id) === String(userData.id));
            if (!stillOnline) {
                onlineUsers.delete(String(userData.id));
                // console.log(`📉 User logged out completely: ${userData.username}`);
                console.log(`📊 Total Unique Online: ${onlineUsers.size}`);
                io.emit('online_users_update', Array.from(onlineUsers));
            }
        } else {
            console.log('🔌 Anonymous connection closed:', socket.id);
        }
    });
});

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://student-2-3ow8.onrender.com', 'https://student-2.pages.dev', 'https://student-2-temprory.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
    credentials: true
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.text({ limit: '100mb' }));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
import auth from './routes/auth.js';
import content from './routes/content.js';
import notes from './routes/notes.js';
import sections from './routes/sections.js';
import practicals from './routes/practicals.js';
import feedback from './routes/feedback.js';
import notification from './routes/notification.js';
import community from './routes/community.js';
import aiasistant from './routes/aiasistant.js'
import aicodehelper from  "./routes/aicodehelper.js"

// import email from './routes/email.js';
app.use('/api/auth', auth);
app.use('/api/content', content);
app.use('/api/notes', notes);
app.use('/api/sections', sections);
app.use('/api/practicals', practicals);
app.use('/api/feedback', feedback);
app.use('/api/notifications', notification);
app.use('/api/community', community);
app.use('/api/aiassistant', aiasistant);
app.use('/api/aicodehelper', aicodehelper);
// app.use('/api/email', email);


// Track user activity
import activityTrack from './routes/activitytrack.js';
import guestTrack from './routes/guesttrack.js';

app.use('/api/hometracking', activityTrack);
app.use('/api/trackingData', activityTrack);
app.use('/api/guesttrack', guestTrack);

app.get('/', (req, res) => {
    res.send('API is running with Socket.io...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
