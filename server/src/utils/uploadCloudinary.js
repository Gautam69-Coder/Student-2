import fs from 'fs';
import getCloudinary from '../config/cloudinary.js';

export const uploadCloudinary = async (filePath) => {
    try {
        const cloudinary = getCloudinary(); // ← config runs here, env is ready
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "UserNotes",
            resource_type: "raw",
            access_mode: "public",  
            type: "upload"   
        });

        fs.unlinkSync(filePath);
        return result;
    } catch (err) {
        console.error("File not uploaded:", err);
        throw err; 
    }
};