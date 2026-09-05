import Groq from "groq-sdk";
import { decrypt } from "./crypto.js";
import User from "../models/User.js";
import { ApiError } from "./ApiError.js";

/**
 * Retrieves and decrypts the user's stored Groq API key.
 * @param {string} userId
 * @returns {Promise<string>} Decrypted API Key
 */
export async function getUserApiKey(userId) {
    const user = await User.findById(userId);
    if (!user || (!user.apiKey && !user.iv)) {
        throw new ApiError(400, "Please add your api key");
    }
    return decrypt(user.apiKey, user.iv);
}

/**
 * Initializes and returns a Groq client for the authenticated user.
 * @param {string} userId
 * @returns {Promise<Groq>} Groq Client instance
 */
export async function getUserGroqClient(userId) {
    const apiKey = await getUserApiKey(userId);
    return new Groq({ apiKey });
}
