import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import admin from '../config/firebase.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// BUG-1 fix: Whitelist of fields allowed in updateProfile
const ALLOWED_PROFILE_FIELDS = ['username', 'email', 'password', 'avatar'];

export const register = asyncHandler(async (req, res) => {
    const { username, email, password, role, adminSecret } = req.body;

    // BUG-4 fix: Input validation
    if (!username || typeof username !== 'string' || username.trim().length < 3 || username.trim().length > 30) {
        throw new ApiError(400, 'Username must be between 3 and 30 characters');
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ApiError(400, 'Please provide a valid email address');
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        throw new ApiError(400, 'Password must be at least 6 characters long');
    }

    if (role === 'admin') {
        if (adminSecret !== process.env.ADMIN_SECRET) {
            throw new ApiError(400, 'Invalid Admin Secret');
        }
    }
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
        if (user.email === email) {
            throw new ApiError(400, 'Email is already registered');
        }
        if (user.username === username) {
            throw new ApiError(400, 'Username is already taken');
        }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    const payload = { id: user.id, role: user.role };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 * 24 }, (err, token) => {
        if (err) throw err;
        // BUG-11 fix: Use sameSite 'none' with secure for cross-origin cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600 * 24 * 1000 // 1 day
        });
        res.status(201).json(new ApiResponse(201, { token, user: { id: user.id, username: user.username, role: user.role, email: user.email } }, "User registered successfully"));
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // BUG-5 fix: Removed console.log(password) — never log plaintext passwords
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, 'Invalid credentials');
    }
    // BUG-5 fix: Removed console.log("User :", user) — leaks hashed password

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(400, 'Invalid credentials');
    }
    
    // Increment visit count
    user.visitCount = (user.visitCount || 0) + 1;
    await user.save();

    const payload = { id: user.id, role: user.role };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" }, (err, token) => {
        if (err) throw err;
        // BUG-11 fix: Use sameSite 'none' with secure for cross-origin cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 30 * 24 * 3600 * 1000 // 30 days
        });
        res.status(200).json(new ApiResponse(200, { token, user: { id: user.id, username: user.username, role: user.role, email: user.email } }, "Login successful"));
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    let field = req.body.field;

    if (field.confirmPassword) {
        delete field.confirmPassword;
    }

    // BUG-1 fix: Whitelist allowed fields — prevents privilege escalation
    // Previously any field (including 'role') could be set via { field: { role: "superadmin" } }
    const sanitizedField = {};
    for (const key of ALLOWED_PROFILE_FIELDS) {
        if (field[key] !== undefined) {
            sanitizedField[key] = field[key];
        }
    }

    if (Object.keys(sanitizedField).length === 0) {
        throw new ApiError(400, 'No valid fields to update');
    }

    if (sanitizedField.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(sanitizedField.password, salt);
        sanitizedField.password = hashedPassword;
    }

    const updateUserInfo = await User.findByIdAndUpdate(
        userId,
        { $set: sanitizedField },
        { new: true }
    ).select('-password -__v -visitCount -currentVisit -currentVisitTime -lastVisitTime');

    res.status(200).json(new ApiResponse(200, { user: updateUserInfo, type: "success" }, "Profile updated successfully"));
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const googleLogin = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const decoded = await admin.auth().verifyIdToken(token);

    const { user_id, email, name, picture } = decoded;

    const existingUser = await User.findOne({ email });

    // BUG-10 fix: Don't overwrite existing non-Google users (prevents admin account hijack)
    if (existingUser && !existingUser.isGoogleUser) {
        // Existing user registered with email/password — don't overwrite their data
        // Just return the existing user without modifying their role/username
        return res.status(200).json(new ApiResponse(200, { user: existingUser }, "Login successful"));
    }

    const newUser = await User.findOneAndUpdate(
        { email },
        {
            $set: {
                avatar: picture,
                username : name,
                uid: user_id,
                isGoogleUser: true
            },
        },
        {
            upsert: true,
            new: true
        }
    );

    res.status(200).json(new ApiResponse(200, { user: newUser }, "Login successful"));
});

export const adminAccess = asyncHandler(async (req, res) => {
    const { password } = req.body;

    // BUG-2 fix: Use timing-safe comparison to prevent timing attacks
    // Also note: this endpoint is still public but now has rate limiting via authLimiter
    const adminPass = process.env.ADMIN_PASS || '';
    const inputBuffer = Buffer.from(password || '');
    const secretBuffer = Buffer.from(adminPass);

    // Ensure both buffers are the same length for timingSafeEqual
    if (inputBuffer.length === secretBuffer.length && crypto.timingSafeEqual(inputBuffer, secretBuffer)) {
        return res.status(200).json(new ApiResponse(200, { success: true }, "Admin access granted"));
    }
    throw new ApiError(401, 'Invalid Admin Password');
});

export const verifyUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(new ApiResponse(200, user, "Success"));
});

export const trackVisit = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
        user.visitCount = (user.visitCount || 0) + 1;
        await user.save();
    }
    res.status(200).json(new ApiResponse(200, { success: true }, "Visit tracked"));
});

export const getUsers = asyncHandler(async (req, res) => {
    const requestingUser = await User.findById(req.user.id);
    if (!['admin', 'superadmin'].includes(requestingUser.role)) {
        throw new ApiError(403, 'Access denied');
    }

    const users = await User.find().select('-password').sort({ visitCount: -1 });
    res.status(200).json(new ApiResponse(200, users, "Success"));
});

export const deleteUser = asyncHandler(async (req, res) => {
    const requestingUser = await User.findById(req.user.id);
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
        throw new ApiError(404, 'User not found');
    }

    if (requestingUser.role === 'superadmin') {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json(new ApiResponse(200, null, 'User deleted'));
    }

    if (requestingUser.role === 'admin') {
        if (userToDelete.role === 'user') {
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).json(new ApiResponse(200, null, 'User deleted'));
        } else {
            throw new ApiError(403, 'Admins can only delete regular users');
        }
    }

    throw new ApiError(403, 'Access denied');
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const requestingUser = await User.findById(req.user.id);
    if (requestingUser.role !== 'superadmin') {
        throw new ApiError(403, 'Access denied. Only Superadmin can change roles.');
    }

    const { role } = req.body;
    if (!['user', 'admin', 'superadmin'].includes(role)) {
        throw new ApiError(400, 'Invalid role');
    }

    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) {
        throw new ApiError(404, 'User not found');
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    res.status(200).json(new ApiResponse(200, { user: { id: userToUpdate.id, username: userToUpdate.username, role: userToUpdate.role } }, 'User role updated'));
});

export const toggleBookmark = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const practicalId = req.params.id;

    const isBookmarked = user.bookmarks.some(id => id.toString() === practicalId);

    if (isBookmarked) {
        user.bookmarks = user.bookmarks.filter(id => id.toString() !== practicalId);
        await user.save();
        return res.status(200).json(new ApiResponse(200, { bookmarks: user.bookmarks }, 'Bookmark removed'));
    } else {
        user.bookmarks.push(practicalId);
        await user.save();
        return res.status(200).json(new ApiResponse(200, { bookmarks: user.bookmarks }, 'Bookmark added'));
    }
});

export const getBookmarks = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('bookmarks');
    res.status(200).json(new ApiResponse(200, user.bookmarks, "Success"));
});
