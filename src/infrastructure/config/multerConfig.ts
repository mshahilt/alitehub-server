import multer from "multer";
import multerS3 from "multer-s3";
import {s3} from './amazons3Config'

export const upload = multer({storage: multer.memoryStorage()});

export const videoUpload = multer

export const pdfUpload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME!,
        key: (req, file, cb) => {
            console.log("inside multer", file)
            cb(null, `uploads/${Date.now()}-${file.originalname}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if(file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDFs are allowed!"));
        }
        cb(null, true)
    }
})
