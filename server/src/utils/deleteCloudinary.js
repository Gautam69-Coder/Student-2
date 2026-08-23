import getCloudinary from "../config/cloudinary.js";

export const deleteCloudinary = (public_id) => {
    const cloudinary = getCloudinary();
    const result = cloudinary.uploader.destroy(public_id, { resource_type: "raw" }, (error, result) => {
        console.log(error)
    })
    return result
}