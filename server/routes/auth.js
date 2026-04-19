import express from 'express';
import auth from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import admin from '../config/fireBaseAdmin.js';

const router = express.Router();
// Register
router.post('/register', async (req, res) => {
    const { username, email, password, role, adminSecret } = req.body;
    try {
        if (role === 'admin') {
            if (adminSecret !== process.env.ADMIN_SECRET) {
                return res.status(400).json({ msg: 'Invalid Admin Secret' });
            }
        }
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            if (user.email === email) {
                return res.status(400).json({ msg: 'Email is already registered' });
            }
            if (user.username === username) {
                return res.status(400).json({ msg: 'Username is already taken' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword, role });
        await user.save();

        const payload = { id: user.id, role: user.role };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 * 24 }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600 * 24 * 1000 // 1 day
            });
            res.json({ token, user: { id: user.id, username: user.username, role: user.role, email: user.email } });
        });
    } catch (err) {
        res.status(500).send('Server Error');
        console.error(err)
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
        // console.log("User :", user)

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Increment visit count
        user.visitCount = (user.visitCount || 0) + 1;
        await user.save();

        const payload = { id: user.id, role: user.role };

        // console.log("Payload:", payload);
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 3600 * 1000 // 30 days
            });
            res.json({ token, user: { id: user.id, username: user.username, role: user.role, email: user.email } });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

//Update Profile
router.post('/update-profile', auth, async (req, res) => {
    try {
        const userId = req.user.id
        let field = req.body.field

        if (field.confirmPassword) {
            delete field.confirmPassword
        }

        if (field.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(field.password, salt);
            field = { ...field, password: hashedPassword }
        }

        const updateUserInfo = await User.findByIdAndUpdate(
            userId,
            { $set: field },
            { new: true }
        ).select('-password -__v -visitCount -currentVisit -currentVisitTime -lastVisitTime');

        res.json({ msg: "Profile updated successfully", type: "success", user: updateUserInfo })
    } catch (err) {
        res.status(500).send('Server Error');
    }
})

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ msg: 'Logged out successfully' });
});

router.post("/google", async (req, res) => {
    const { token } = req.body;

    try {
        // ✅ Verify Firebase token

        const decoded = await admin.auth().verifyIdToken(token);

        const { uid, email, name, picture } = decoded;

        // 🔍 Check if user exists
        let user = await User.findOne({ email });
        let isGoogleUser = true;

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar: picture,
                uid,
                isGoogleUser
            });
        } else {
            user = await User.findOneAndUpdate(
                { email },
                {
                    $set: {
                        name,
                        avatar: picture,
                        uid,
                        isGoogleUser
                    }
                },
                { new: true }
            );
        }

        
        res.json({
            message: "Login successful",
            user,
        });
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
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
        // console.log("Verified User:", user);
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
        console.error("Error fetching user data:", err);
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

        const users = await User.find().select('-password').sort({ visitCount: -1 });
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

// Toggle Bookmark
router.put('/bookmark/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const practicalId = req.params.id;

        // Check if already bookmarked using toString for safe comparison
        const isBookmarked = user.bookmarks.some(id => id.toString() === practicalId);

        if (isBookmarked) {
            // Remove
            user.bookmarks = user.bookmarks.filter(id => id.toString() !== practicalId);
            await user.save();
            return res.json({ msg: 'Bookmark removed', bookmarks: user.bookmarks });
        } else {
            // Add
            user.bookmarks.push(practicalId);
            await user.save();
            return res.json({ msg: 'Bookmark added', bookmarks: user.bookmarks });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Bookmarks
router.get('/bookmarks', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('bookmarks');
        res.json(user.bookmarks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
