import crypto from "crypto"

const ALGORITHM = "aes-256-cbc";

// Must be 32 bytes long
const SECRET_KEY = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_SECRET)
    .digest();

function encrypt(text) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        ALGORITHM,
        SECRET_KEY,
        iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
        iv: iv.toString("hex"),
        encryptedData: encrypted,
    };
}

function decrypt(encryptedData, iv) {
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        SECRET_KEY,
        Buffer.from(iv, "hex")
    );

    let decrypted = decipher.update(
        encryptedData,
        "hex",
        "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
}

export  {
    encrypt,
    decrypt,
};