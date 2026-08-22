import express from 'express';
import auth from '../middleware/auth.js';
import uploadMulter from '../middleware/multer.js';
import { 
    getNotes, getAllNotes, createNoteFile, createNoteText, 
    updateNoteText, deleteNote, togglePublicStatus ,updateNoteFile
} from '../controllers/notes.controller.js';

const router = express.Router();

router.get('/', getNotes);
router.get('/all', auth, getAllNotes);

router.post('/file', auth, uploadMulter.single("file"), createNoteFile);
router.post('/text', auth, createNoteText);

router.put('/', auth, updateNoteText);
router.put('/file', auth, uploadMulter.single("file"), updateNoteFile);

router.delete('/:id', auth, deleteNote);
router.put('/public/:id', auth, togglePublicStatus);

export default router;
