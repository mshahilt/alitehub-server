import express from "express";
import userRoutes from "./interfaces/routes/UserRoutes";
import dotenv from "dotenv";
import { connectDB } from "./infrastructure/config/database";

dotenv.config();

const app = express();
app.use(express.json());

// routes
app.use("/users", userRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(process.env.PORT, () => console.log("Server is running on port 5000"));
}

startServer();