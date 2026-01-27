const express = require('express');
const router = express.Router();
const UserNote = require('../models/UserNote');
const auth = require('../middleware/auth');

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
router.post('/', auth, async (req, res) => {
    const { title, content, section, isGlobal, fileName, fileType, fileData } = req.body;
    try {
        // Only admin can create global notes
        let noteIsGlobal = false;
        if (isGlobal) {
            if (req.user.role === 'admin') {
                noteIsGlobal = true;
            }
        }

        const newNote = new UserNote({
            user: req.user.id,
            title,
            content,
            section: section || 'General',
            fileName,
            fileType,
            fileData,
            isGlobal: noteIsGlobal
        });
        const note = await newNote.save();
        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Note
router.put('/:id', auth, async (req, res) => {
    const { title, content, section, fileName, fileType, fileData } = req.body;
    try {
        let note = await UserNote.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        // Check user
        if (note.user.toString() !== req.user.id && req.user.role !== 'admin') {
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

module.exports = router;
