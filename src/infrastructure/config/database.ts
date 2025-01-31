import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        await mongoose.connect(mongoUri);
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connections error:", error);
        process.exit(1);
    }
}