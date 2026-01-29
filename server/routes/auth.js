const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    const { username, email, password, role, adminSecret } = req.body;
    try {
        if (role === 'admin') {
            if (adminSecret !== process.env.ADMIN_SECRET) {
                return res.status(400).json({ msg: 'Invalid Admin Secret' });
            }
        }
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword, role });
        await user.save();

        const payload = { id: user.id, role: user.role };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 * 24 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
        });
    } catch (err) {
        res.status(500).send('Server Error');
        console.log(err)
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Increment visit count
        user.visitCount = (user.visitCount || 0) + 1;
        await user.save();

        const payload = { id: user.id, role: user.role };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Admin Access Check
router.post('/admin-access', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASS) {
        return res.json({ success: true });
    }
    return res.status(401).json({ success: false });
});

// Get User Data
router.get('/verify', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Track Visit (Explicitly called when user lands on the page)
router.post('/track-visit', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.visitCount = (user.visitCount || 0) + 1;
            await user.save();
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get All Users (Admin only ideally, but for now authenticated)
router.get('/users', auth, async (req, res) => {
    try {
        // Optional: Check if requesting user is admin
        const requestingUser = await User.findById(req.user.id);
        if (!['admin', 'superadmin'].includes(requestingUser.role)) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete User
router.delete('/users/:id', auth, async (req, res) => {
    try {
        // Optional: Check if requesting user is admin
        const requestingUser = await User.findById(req.user.id);
        const userToDelete = await User.findById(req.params.id);

        if (!userToDelete) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (requestingUser.role === 'superadmin') {
            // Superadmin can delete anyone
            await User.findByIdAndDelete(req.params.id);
            return res.json({ msg: 'User deleted' });
        }

        if (requestingUser.role === 'admin') {
            if (userToDelete.role === 'user') {
                await User.findByIdAndDelete(req.params.id);
                return res.json({ msg: 'User deleted' });
            } else {
                return res.status(403).json({ msg: 'Admins can only delete regular users' });
            }
        }

        return res.status(403).json({ msg: 'Access denied' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update User Role (Superadmin only)
router.put('/users/:id/role', auth, async (req, res) => {
    try {
        const requestingUser = await User.findById(req.user.id);
        if (requestingUser.role !== 'superadmin') {
            return res.status(403).json({ msg: 'Access denied. Only Superadmin can change roles.' });
        }

        const { role } = req.body;
        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role' });
        }

        const userToUpdate = await User.findById(req.params.id);
        if (!userToUpdate) {
            return res.status(404).json({ msg: 'User not found' });
        }

        userToUpdate.role = role;
        await userToUpdate.save();

        res.json({ msg: 'User role updated', user: { id: userToUpdate.id, username: userToUpdate.username, role: userToUpdate.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
