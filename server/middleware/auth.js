import jwt from 'jsonwebtoken';
import admin from '../config/fireBaseAdmin.js';
import User from '../models/User.js';

const auth = async (req, res, next) => {
    const token = req.header('x-auth-token') || req.cookies.token;
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log("JWT Decoded:", decoded);

            req.user = decoded;
            next();
        } catch (err) {
            const decodedToken = await admin.auth().verifyIdToken(token);
            const email = decodedToken.email;

            let user = await User.findOne({ email });
            req.user = user;
            next();
        }
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
        console.error('❌ Token verification failed:', e);
    }
};

export default auth;
