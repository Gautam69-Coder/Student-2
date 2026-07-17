import dotenv from 'dotenv';
dotenv.config();

import { validateEnv } from './utils/validateEnv.js';
// Validate required env vars before anything else (BUG-12 fix)
validateEnv();

import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './services/socket.service.js';

// Database Connection
connectDB();

// HTTP Server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173','http://localhost:5175','http://localhost:5001', 'http://127.0.0.1:5173', 'https://student-2-3ow8.onrender.com', 'https://student-2.pages.dev', 'https://student-2-temprory.onrender.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    }
});

// Helper to parse cookie from headers
const parseCookie = (cookieHeader, name) => {
    if (!cookieHeader) return null;
    const cookies = cookieHeader.split(';');
    for (let c of cookies) {
        const [k, v] = c.trim().split('=');
        if (k === name) return v;
    }
    return null;
};

// Socket.io authentication middleware (BUG-3 fix)
// Verify JWT on handshake — reject unauthenticated connections from emitting user events
io.use((socket, next) => {
    const token = socket.handshake.auth?.token || parseCookie(socket.handshake.headers?.cookie, 'token');
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // Attach verified user to socket
            return next();
        } catch (err) {
            // Allow connection but without user — they just won't be able to emit user events
            socket.user = null;
            return next();
        }
    }
    // Allow anonymous connections (guests) but without user identity
    socket.user = null;
    next();
});

// Initialize Socket Presence Tracking
initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
