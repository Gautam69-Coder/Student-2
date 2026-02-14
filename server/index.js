const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://student-2-3ow8.onrender.com', 'https://student-2.pages.dev'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    }
});

const User = require('./models/User');
const { time } = require('console');

// Presence Tracking
const onlineUsers = new Set();
const userMap = new Map(); // socket.id -> { userId, username }

io.on('connection', (socket) => {
    console.log('🔌 New connection attempt:', socket.id);

    socket.on('user_online', async (userData) => {
        if (userData && userData.id) {
            const userId = String(userData.id);
            onlineUsers.add(userId);
            userMap.set(socket.id, { ...userData, id: userId });

            console.log(`👤 User Registered: ${userData.username} [ID: ${userId}]`);

            try {
                // Increment visit count in database
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        $inc: { visitCount: 1 },
                        lastVisit: new Date(),
                        time: new Date().toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                        })
                    },
                    { new: true }
                );

                console.log(`📈 Visit count updated for ${userData.username}: ${updatedUser?.visitCount}`);
                console.log(`📈 Visit count updated for ${userData.username}: ${updatedUser?.lastVisit}`);

                // Broadcast update so admin table sees new visit count
                io.emit('user_stats_update', {
                    userId: userId,
                    visitCount: updatedUser?.visitCount,
                    lastVisit : updatedUser?.lastVisit,
                });
            } catch (err) {
                console.error('❌ Error updating visit count:', err.message);
            }

            console.log(`📊 Total Unique Online: ${onlineUsers.size}`);

            io.emit('online_users_update', Array.from(onlineUsers));
            io.emit('user_visit', { ...userData, timestamp: new Date() });
        } else {
            console.log('⚠️ Received invalid user_online data:', userData);
        }
    });

    socket.on('user_logout',async () => {
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

    socket.on('disconnect', () => {
        const userData = userMap.get(socket.id);
        if (userData) {
            console.log(`👋 Socket Disconnected: ${userData.username} (${socket.id})`);
            userMap.delete(socket.id);

            // Check if user has other tabs open
            const stillOnline = Array.from(userMap.values()).some(u => String(u.id) === String(userData.id));
            if (!stillOnline) {
                onlineUsers.delete(String(userData.id));
                console.log(`📉 User logged out completely: ${userData.username}`);
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
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://student-2-3ow8.onrender.com', 'https://student-2.pages.dev'],
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
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/practicals', require('./routes/practicals'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/email', require('./routes/email'));

app.get('/', (req, res) => {
    res.send('API is running with Socket.io...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
