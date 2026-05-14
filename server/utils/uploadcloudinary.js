import fs from 'fs';
import getCloudinary from '../config/cloudinary.js';

export const uploadCloudinary = async (filePath) => {
    try {
        const cloudinary = getCloudinary(); // ← config runs here, env is ready
        const result = await cloudinary.uploader.upload_stream(filePath, {
            folder: "UserNotes",
            resource_type: "auto",
            access_mode: "public",  // ← Add this
            type: "upload"   
        });

        fs.unlinkSync(filePath);
        return result;
    } catch (err) {
        console.error("File not uploaded:", err);
        throw err; // ← re-throw so the route catches it too
    }
};