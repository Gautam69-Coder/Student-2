import UserNote from '../models/UserNote.js';
import { uploadCloudinary } from '../utils/uploadCloudinary.js';
import { deleteCloudinary } from '../utils/deleteCloudinary.js';
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
    const { title, section, content } = req.body;
    const file = req.file;

    let fileData = "NAN";
    let fileName = "NAN";
    let fileType = "NAN";

    if (file) {
        const filePath = file.path;
        const uploadFile = await uploadCloudinary(filePath);
        fileData = uploadFile.secure_url;
        fileName = file.originalname;
        fileType = file.mimetype;
    }

    const newNote = new UserNote({
        user: req.user.id,
        title,
        section: section || 'General',
        fileName,
        fileType,
        fileData,
        content: content || 'NAN'
    });
    const note = await newNote.save();

    res.status(201).json(new ApiResponse(201, { noteData: note }, "Note Uploaded Successfully"));
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

export const updateNoteText = asyncHandler(async (req, res) => {
    const { title, code, section,noteId } = req.body;

    const updateNote = {};

    if (title !== undefined) updateNote.title = title;
    if (section !== undefined) updateNote.section = section;
    if (code !== undefined) updateNote.content = code;


    const updateData = await UserNote.findByIdAndUpdate(
        noteId,
        {
            $set: updateNote
        },
        { new: true }
    )


    res.status(201).json(new ApiResponse(201, { noteData: updateData }, "File Uploaded Successfully"));

});

//To Delete Previous file from Cloudinary;
const publicId = async (url) => {
    const cloudinaryUrl = url.toString();
    const parts = cloudinaryUrl.split("/upload/")[1];
    const public_id = parts.split("/").slice(1).join("/");
    return public_id;
}

export const updateNoteFile = asyncHandler(async (req, res) => {
    const { title, section, previousFileUrl, noteId, isNewFile, content } = req.body;
    const filePath = req?.file?.path;
    const file = req?.file;
    const isNew = isNewFile === 'true' || isNewFile === true;

    if (previousFileUrl && previousFileUrl !== "NAN" && isNew) {
        try {
            const public_id = await publicId(previousFileUrl);
            const result = await deleteCloudinary(public_id);
            console.log("Cloudinary deleted: ", result);
        } catch (err) {
            console.error("Failed to delete old file from Cloudinary: ", err);
        }
    }
    const updateNote = {};

    if (title !== undefined) updateNote.title = title;
    if (section !== undefined) updateNote.section = section;
    if (content !== undefined) updateNote.content = content || "NAN";

    if (isNew) {
        if (file) {
            const uploadFile = await uploadCloudinary(filePath);
            updateNote.fileName = file.originalname;
            updateNote.fileType = file.mimetype;
            updateNote.fileData = uploadFile.secure_url;
        } else {
            updateNote.fileName = "NAN";
            updateNote.fileType = "NAN";
            updateNote.fileData = "NAN";
        }
    }

    const updateData = await UserNote.findByIdAndUpdate(
        noteId,
        {
            $set: updateNote
        },
        { new: true }
    )
    console.log(updateNote);
    res.status(201).json(new ApiResponse(201, { noteData: updateData }, "Note Update Successfully"));

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
