import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// uploads folder path
const uploadPath = path.join(__dirname, "../../uploads")

// create uploads folder if not exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
}

// Allowed file extensions (BUG-7 fix)
const ALLOWED_EXTENSIONS = /\.(pdf|doc|docx|png|jpg|jpeg|txt|pptx|xlsx|csv)$/i;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath)
    },

    filename: (req, file, cb) => {
        // Sanitize filename: remove path traversal characters (BUG-7 fix)
        const sanitized = file.originalname
            .replace(/[/\\]/g, '_')    // Replace path separators
            .replace(/\.\./g, '_')      // Remove double-dots
            .replace(/[^a-zA-Z0-9._-]/g, '_'); // Only allow safe chars
        cb(null, Date.now() + "-" + sanitized)
    }
})

// File filter — reject unsafe file types (BUG-7 fix)
const fileFilter = (req, file, cb) => {
    if (ALLOWED_EXTENSIONS.test(path.extname(file.originalname).toLowerCase())) {
        cb(null, true)
    } else {
        cb(new Error('File type not allowed. Accepted: pdf, doc, docx, png, jpg, jpeg, txt, pptx, xlsx, csv'), false)
    }
}

const uploadMulter = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max per file
    }
})

export default uploadMulter