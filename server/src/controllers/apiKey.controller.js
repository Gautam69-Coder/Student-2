import { encrypt } from "../utils/crypto.js";
import User from "../models/User.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const saveApiKey = asyncHandler(async (req, res) => {
    const { data } = req.body;
    const userId = req.user.id;

    if (!data.apiKeyInput) {
        throw new ApiError(400, "Api key is undefined");
    }

    const encrypted = encrypt(data.apiKeyInput);

    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                apiKey: encrypted.encryptedData,
                iv: encrypted.iv
            }
        },
        { upsert: true, new: true }
    );
    
    res.status(200).json(new ApiResponse(200, null, "Api key safely Save"));
});
