import mongoose from 'mongoose';
import { autoSeedCodingPractices } from '../seeds/seedCodingPractices.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await autoSeedCodingPractices();
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;

