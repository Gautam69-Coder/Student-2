import express from 'express';
import auth from '../middleware/auth.js';
import uploadMulter from '../middleware/multer.js';
import { 
    getNotes, getAllNotes, createNoteFile, createNoteText, 
    updateNote, deleteNote, togglePublicStatus 
} from '../controllers/notes.controller.js';

const router = express.Router();

router.get('/', getNotes);
router.get('/all', auth, getAllNotes);
router.post('/file', auth, uploadMulter.single("file"), createNoteFile);
router.post('/text', auth, createNoteText);
router.put('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);
router.put('/public/:id', auth, togglePublicStatus);

export default router;
