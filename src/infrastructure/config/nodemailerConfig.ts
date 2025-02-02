import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
})

console.log("yeah, i am working inside nodemailer config",process.env.SMTP_EMAIL)
console.log("yeah, i am working inside nodemailer config",process.env.SMTP_PASSWORD)

export default transporter;