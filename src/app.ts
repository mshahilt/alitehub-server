import express from "express";
import userRoutes from "./interfaces/routes/UserRoutes";
import authRoutes from './interfaces/routes/testRoutes';
import comapnyRoutes from "./interfaces/routes/CompanyRoutes";
import dotenv from "dotenv";
import { connectDB } from "./infrastructure/config/database";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

// routes
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/company", comapnyRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(process.env.PORT, () => console.log("Server is running on port 5000"));
}

startServer();