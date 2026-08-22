import UserNote from '../models/UserNote.js';
import { uploadCloudinary } from '../utils/uploadCloudinary.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import auth from '../middleware/auth.js';


export const getNotes = asyncHandler(async (req, res) => {
    const token = req.header('x-auth-token') || req.cookies?.token;
    let query = { isGlobal: true };

    if (token) {
        try {
            const jwt = (await import('jsonwebtoken')).default;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            query = {
                $or: [
                    { user: decoded.id },
                    { isGlobal: true }
                ]
            };
        } catch (err) {
            console.error("Token invalid in public notes route");
        }
    }
    
    // Support pagination for infinite scroll if page/limit parameters are provided
    if (req.query.page || req.query.limit) {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const totalNotes = await UserNote.countDocuments(query);
        const notes = await UserNote.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json(new ApiResponse(200, {
            notes,
            pagination: {
                totalNotes,
                currentPage: page,
                totalPages: Math.ceil(totalNotes / limit),
                hasMore: skip + notes.length < totalNotes
            }
        }, "Success"));
    }

    const notes = await UserNote.find(query).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, notes, "Success"));
});

export const getAllNotes = asyncHandler(async (req, res) => {
    if (!['admin', 'superadmin'].includes(req.user.role)) {
        throw new ApiError(403, 'Access denied');
    }
    const notes = await UserNote.find().populate('user', 'username email').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, notes, "Success"));
});

export const createNoteFile = asyncHandler(async (req, res) => {
    const { title, section } = req.body;
    const filePath = req.file.path;
    const file = req.file;
    
    const uploadFile = await uploadCloudinary(filePath);

    const newNote = new UserNote({
        user: req.user.id,
        title,
        section: section || 'General',
        fileName: file.originalname,
        fileType: file.mimetype,
        fileData: uploadFile.secure_url
    });
    const note = await newNote.save();

    res.status(201).json(new ApiResponse(201, { noteData: note }, "File Uploaded Successfully"));
});

export const createNoteText = asyncHandler(async (req, res) => {
    const { title, code, section } = req.body;
    const newNote = new UserNote({
        user: req.user.id,
        title,
        content: code,
        section: section || 'General',
    });
    const note = await newNote.save();
    res.status(201).json(new ApiResponse(201, { noteData: note }, "Code Uploaded Successfully"));
});

export const updateNote = asyncHandler(async (req, res) => {
    const { title, content, section, fileName, fileType, fileData } = req.body;
    let note = await UserNote.findById(req.params.id);
    if (!note) {
        throw new ApiError(404, 'Note not found');
    }

    if (note.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        throw new ApiError(401, 'Not authorized');
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.section = section || note.section;
    note.fileName = fileName || note.fileName;
    note.fileType = fileType || note.fileType;
    note.fileData = fileData || note.fileData;

    await note.save();
    res.status(200).json(new ApiResponse(200, note, "Note updated successfully"));
});

export const deleteNote = asyncHandler(async (req, res) => {
    let note = await UserNote.findById(req.params.id);
    if (!note) {
        throw new ApiError(404, 'Note not found');
    }

    if (note.user.toString() !== req.user.id && !['admin', 'superadmin'].includes(req.user.role)) {
        throw new ApiError(401, 'Not authorized');
    }

    await UserNote.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Note removed'));
});

export const togglePublicStatus = asyncHandler(async (req, res) => {
    let note = await UserNote.findById(req.params.id);
    if (!note) {
        throw new ApiError(404, 'Note not found');
    }

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        throw new ApiError(403, 'Only admins are authorized to toggle public/private status of notes');
    }

    const userFind = await UserNote.findById(note.id);

    if (userFind.isGlobal) {
        userFind.isGlobal = false;
    } else {
        userFind.isGlobal = true;
    }

    await userFind.save();
    res.status(200).json(new ApiResponse(200, userFind, "Note visibility updated"));
});
