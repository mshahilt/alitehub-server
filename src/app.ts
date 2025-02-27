import express from "express";
import userRoutes from "./interfaces/routes/UserRoutes";
import authRoutes from './interfaces/routes/AuthRoutes';
import comapnyRoutes from "./interfaces/routes/CompanyRoutes";
import adminRoutes from "./interfaces/routes/AdminRoutes";
import applicationRoutes from "./interfaces/routes/ApplicationRoutes"
import jobRoutes from "./interfaces/routes/JobRoutes";
import dotenv from "dotenv";
import { connectDB } from "./infrastructure/config/database";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}));

app.use(cookieParser());

// routes
app.use("/auth", authRoutes);
app.use("/job", jobRoutes);
app.use("/company", comapnyRoutes);
app.use("/application", applicationRoutes);
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(process.env.PORT, () => console.log("Server is running on port 5000"));
}

startServer();