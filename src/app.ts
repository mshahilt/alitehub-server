import express from "express";
import userRoutes from "./interfaces/routes/UserRoutes";
import authRoutes from "./interfaces/routes/AuthRoutes";
import companyRoutes from "./interfaces/routes/CompanyRoutes";
import adminRoutes from "./interfaces/routes/AdminRoutes";
import applicationRoutes from "./interfaces/routes/ApplicationRoutes";
import jobRoutes from "./interfaces/routes/JobRoutes";
import postRoutes from "./interfaces/routes/PostRoutes";
import searchRoutes from "./interfaces/routes/searchRoutes";
import connectionRoutes from "./interfaces/routes/ConnectionRoutes";
import dotenv from "dotenv";
import { connectDB } from "./infrastructure/config/database";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { connectRabbitMQ, sendNotification, consumeNotifications } from "./infrastructure/config/rabbitmqConfig";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/search", searchRoutes);
app.use("/connection", connectionRoutes);
app.use("/job", jobRoutes);
app.use("/company", companyRoutes);
app.use("/application", applicationRoutes);
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

// Socket.IO Handling
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("send_notification", (data) => {
        sendNotification(data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


const startServer = async () => {
    try {
        await connectDB();
        await connectRabbitMQ();
        await consumeNotifications(io);

        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
};

startServer();
