import express, { Express, Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import { createServer, Server as HttpServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./infrastructure/config/database";
import {
  connectRabbitMQ,
  sendNotification,
  consumeNotifications,
} from "./infrastructure/config/rabbitmqConfig";
import { setupSocket, userSocketMap} from "./infrastructure/services/SocketHandler";

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
import likeRoutes from "./interfaces/routes/LikeRoutes";
import commentRoutes from "./interfaces/routes/CommentRoutes";
import planRoutes from "./interfaces/routes/PlanRoutes";
import messageRoutes from "./interfaces/routes/MessageRoutes";
import reviewRoutes from "./interfaces/routes/ReviewRoutes";

dotenv.config();

const app: Express = express();
const server: HttpServer = createServer(app);
export const io: Server = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://alitehub.vercel.app", "https://alitehub.site", "http://alitehub.site"],
    credentials: true,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://alitehub.vercel.app", "https://alitehub.site", "http://alitehub.site"],
    credentials: true,
  })
);
app.use(cookieParser());


app.use("/job", jobRoutes);
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/call", callRoutes);
app.use('/chat', messageRoutes);
app.use("/like", likeRoutes);
app.use("/comment", commentRoutes);
app.use("/plan", planRoutes);
app.use("/search", searchRoutes);
app.use("/connection", connectionRoutes);
app.use("/review", reviewRoutes);
app.use("/company", companyRoutes);
app.use("/application", applicationRoutes);
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

setupSocket(io);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await connectRabbitMQ();
    await consumeNotifications(io, userSocketMap);

    const PORT: string | number = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer().catch((err) => console.error("Failed to start server:", err));