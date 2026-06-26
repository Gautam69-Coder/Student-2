import express from 'express';
import auth from '../middleware/auth.js';
import { 
    register, login, updateProfile, logout, googleLogin, 
    adminAccess, verifyUser, trackVisit, getUsers, 
    deleteUser, updateUserRole, toggleBookmark, getBookmarks 
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/update-profile', auth, updateProfile);
router.post('/logout', logout);
router.post("/google", googleLogin);
router.post('/admin-access', adminAccess);
router.get('/verify', auth, verifyUser);
router.post('/track-visit', auth, trackVisit);
router.get('/users', auth, getUsers);
router.delete('/users/:id', auth, deleteUser);
router.put('/users/:id/role', auth, updateUserRole);
router.put('/bookmark/:id', auth, toggleBookmark);
router.get('/bookmarks', auth, getBookmarks);

export default router;
