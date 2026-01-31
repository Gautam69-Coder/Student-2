const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'https://student-2-3ow8.onrender.com', 'https://student-2.pages.dev'],
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
    res.send('API is running...');
});

// Trigger restart
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
