import express from 'express';
import auth from '../middleware/auth.js';
import UserNote from '../models/UserNote.js';
const router = express.Router();
import uploadMulter from '../middleware/multer.js';
import { uploadCloudinary } from '../utils/uploadcloudinary.js';

// Get User Notes (and Global Notes)
router.get('/', auth, async (req, res) => {
    try {
        const notes = await UserNote.find({
            $or: [
                { user: req.user.id },
                { isGlobal: true }
            ]
        }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get All Notes (Admin Only)
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const notes = await UserNote.find().populate('user', 'username email').sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Note
router.post('/file', auth, uploadMulter.single("file"), async (req, res) => {
    try {
        const { title, section } = req.body
        const filePath = req.file.path;
        const file = req.file

        //Upload file to cloudinary 
        const uploadFile = await uploadCloudinary(filePath)
        console.log(uploadFile);
        const newNote = new UserNote({
            user: req.user.id,
            title,
            section: section || 'General',
            fileName: file.originalname,
            fileType: file.mimetype,
            fileData: uploadFile.secure_url
        });
        const note = await newNote.save();

        res.json({ noteData: note, msg: "File Uploaded Successfully", success: true });

    } catch (err) {
        res.status(500).send('Server Error');
        console.log(err)
    }
});

router.post('/text', auth, async (req, res) => {
    const { title, code, section } = req.body;
    try {
        // Only admin can create global notes

        const newNote = new UserNote({
            user: req.user.id,
            title,
            content: code,
            section: section || 'General',
        });
        const note = await newNote.save();
        res.json({ noteData: note, msg: "Code Uploaded Successfully", success: true });
    } catch (err) {
        res.status(500).send('Server Error');
        console.log(err)
    }
});

// Update Note
router.put('/:id', auth, async (req, res) => {
    const { title, content, section, fileName, fileType, fileData } = req.body;
    try {
        let note = await UserNote.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Check user
        if (note.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        note.title = title || note.title;
        note.content = content || note.content;
        note.section = section || note.section;
        note.fileName = fileName || note.fileName;
        note.fileType = fileType || note.fileType;
        note.fileData = fileData || note.fileData;

        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete Note
router.delete('/:id', auth, async (req, res) => {
    try {
        let note = await UserNote.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Allow admin to delete any note
        if (note.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await UserNote.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Note removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.put('/public/:id', auth, async (req, res) => {
    try {
        let note = await UserNote.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Check user
        if (note.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const userFind = await UserNote.findById(note.id);

        if (userFind.isGlobal) {
            userFind.isGlobal = false;
        } else {
            userFind.isGlobal = true;
        }

        await userFind.save();
        res.json(userFind);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;
