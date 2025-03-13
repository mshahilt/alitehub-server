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
import callRoutes from "./interfaces/routes/CallRoutes";
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
app.use("/job", jobRoutes);
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/call", callRoutes);
app.use("/search", searchRoutes);
app.use("/connection", connectionRoutes);
app.use("/company", companyRoutes);
app.use("/application", applicationRoutes);
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

// Socket.io room & user management
const userSocketMap = new Map(); 
export const rooms = new Map();
const activeRooms = new Map(); 

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Register user for notifications
    socket.on("register", (userId) => {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    });

    // Handle joining an interview room
    socket.on("join-room", (roomId) => {
        console.log(`Socket ${socket.id} joined room ${roomId}`);
        socket.join(roomId);
        
        // Notify others in the room that someone is trying to connect
        socket.to(roomId).emit("user-connected");
    });

    // WebRTC Signaling
    socket.on("offer", (roomId, offer) => {
        console.log(`Relaying offer in room ${roomId}`);
        socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", (roomId, answer) => {
        console.log(`Relaying answer in room ${roomId}`);
        socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", (roomId, candidate) => {
        console.log(`Relaying ICE candidate in room ${roomId}`);
        socket.to(roomId).emit("ice-candidate", candidate);
    });

    // Chat messages in interview room
    socket.on("send-message", (roomId, message, sender) => {
        console.log(`Chat message in room ${roomId}`);
        io.to(roomId).emit("receive-message", message, sender);
    });

    // Handle user leaving the interview
    socket.on("leave-room", (roomId) => {
        console.log(`Socket ${socket.id} left room ${roomId}`);
        socket.leave(roomId);
        socket.to(roomId).emit("user-disconnected");
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        // Find which rooms this socket was in
        const rooms = Array.from(socket.rooms);
        rooms.forEach(room => {
            if (room !== socket.id) { // Skip the default room
                socket.to(room).emit("user-disconnected");
            }
        });

        // Remove from userSocketMap
        const userId = [...userSocketMap.entries()].find(([_, id]) => id === socket.id)?.[0];
        if (userId) {
            userSocketMap.delete(userId);
            console.log(`User ${userId} disconnected`);
        }
    });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        await connectRabbitMQ();
        await consumeNotifications(io, userSocketMap);

        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
};

startServer();