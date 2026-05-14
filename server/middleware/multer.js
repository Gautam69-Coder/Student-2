import multer from "multer"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../server/uploads")  // ✅ yeh folder banao project mein
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const uploadMulter = multer({ storage })
export default uploadMulter;