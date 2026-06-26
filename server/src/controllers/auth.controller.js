import jwt, { decode } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import admin from '../config/firebase.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const register = asyncHandler(async (req, res) => {
    const { username, email, password, role, adminSecret } = req.body;
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
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600 * 24 * 1000 // 1 day
        });
        res.status(201).json(new ApiResponse(201, { token, user: { id: user.id, username: user.username, role: user.role, email: user.email } }, "User registered successfully"));
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(password);
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, 'Invalid credentials');
    }
    console.log("User :", user);

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
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
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

    if (field.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(field.password, salt);
        field = { ...field, password: hashedPassword };
    }

    const updateUserInfo = await User.findByIdAndUpdate(
        userId,
        { $set: field },
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
    console.log(decoded);
    const { user_id, email, name, picture } = decoded;

    const user = await User.findOne({ email });
    let isGoogleUser = true;

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

    console.log("New User : ", newUser);

    res.status(200).json(new ApiResponse(200, { newUser }, "Login successful"));
});

export const adminAccess = asyncHandler(async (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASS) {
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
