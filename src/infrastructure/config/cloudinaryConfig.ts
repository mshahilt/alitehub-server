import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export const cloudinaryConfig = () => {
    cloudinary.config({
        cloud_name: "duorbsbbx",
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return cloudinary;
};
