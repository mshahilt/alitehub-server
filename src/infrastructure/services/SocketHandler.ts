import { Server, Socket } from "socket.io";
import { sendNotification } from "../config/rabbitmqConfig";

interface UserData {
  socketId: string;
  userId: string | undefined; 
  userName: string;
  userRole: "interviewer" | "candidate";
}

const userSocketMap: Map<string, string> = new Map(); 
const socketUserMap: Map<string, string> = new Map(); 
export const rooms: Map<string, Set<UserData>> = new Map();

export const setupSocket = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("register", (userId: string) => {
      if (!userId) {
        console.error("Invalid userId provided for registration");
        return socket.emit("error", "Invalid userId");
      }
      userSocketMap.set(userId, socket.id);
      socketUserMap.set(socket.id, userId);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("joinChat", (chatId) => {
      console.log("joined in room ", chatId);
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing", { chatId, userId });
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
      socket.to(chatId).emit("stopTyping", { chatId, userId });
    });


    socket.on("updateMessageStatus", ({ messageId, status, chatId }) => {
      io.to(chatId).emit("messageStatusUpdate", { messageId, status });
    });

    socket.on(
      "join-room",
      (roomId: string, userName: string, userRole: "interviewer" | "candidate") => {
        if (!roomId || !userName || !userRole) {
          console.error("Missing required fields for join-room", { roomId, userName, userRole });
          return socket.emit("error", "Missing roomId, userName, or userRole");
        }

        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set<UserData>());
        }

        const userData: UserData = {
          socketId: socket.id,
          userId: socketUserMap.get(socket.id),
          userName,
          userRole,
        };
        rooms.get(roomId)!.add(userData);

        socket.to(roomId).emit("user-connected", userName, userRole);
        console.log(`Notified peers in room ${roomId} of new user: ${userName} (${userRole})`);

        const participants = Array.from(rooms.get(roomId)!)
          .filter((u) => u.socketId !== socket.id)
          .map((u) => ({ userName: u.userName, userRole: u.userRole }));
        socket.emit("room-participants", participants);
      }
    );

    socket.on("offer", (roomId: string, offer: any, callback?: (ack: { success?: boolean; error?: string }) => void) => {
      if (!rooms.has(roomId) || !rooms.get(roomId)!.size) {
        console.error(`Invalid or empty room ${roomId} for offer`);
        return callback?.({ error: "Room not found or empty" });
      }
      console.log(`Relaying offer in room ${roomId}`);
      socket.to(roomId).emit("offer", offer);
      callback?.({ success: true });
    });

    socket.on("answer", (roomId: string, answer: any, callback?: (ack: { success?: boolean; error?: string }) => void) => {
      if (!rooms.has(roomId) || !rooms.get(roomId)!.size) {
        console.error(`Invalid or empty room ${roomId} for answer`);
        return callback?.({ error: "Room not found or empty" });
      }
      console.log(`Relaying answer in room ${roomId}`);
      socket.to(roomId).emit("answer", answer);
      callback?.({ success: true });
    });

    socket.on(
      "ice-candidate",
      (roomId: string, candidate: any, callback?: (ack: { success?: boolean; error?: string }) => void) => {
        if (!rooms.has(roomId) || !rooms.get(roomId)!.size) {
          console.error(`Invalid or empty room ${roomId} for ICE candidate`);
          return callback?.({ error: "Room not found or empty" });
        }
        console.log(`Relaying ICE candidate in room ${roomId}`);
        socket.to(roomId).emit("ice-candidate", candidate);
        callback?.({ success: true });
      }
    );

    socket.on("leave-room", (roomId: string) => {
      if (!rooms.has(roomId)) return;
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left room ${roomId}`);

      const room = rooms.get(roomId)!;
      const user = Array.from(room).find((u) => u.socketId === socket.id);
      if (user) {
        room.delete(user);
        socket.to(roomId).emit("user-disconnected", user.userName, user.userRole);
        console.log(`User ${user.userName} (${user.userRole}) disconnected from room ${roomId}`);
      }

      if (room.size === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} deleted as it is now empty`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
      const userId = socketUserMap.get(socket.id);

      if (userId) {
        userSocketMap.delete(userId);
        socketUserMap.delete(socket.id);
        console.log(`User ${userId} removed from mappings`);
      }

      for (const [roomId, participants] of rooms) {
        const user = Array.from(participants).find((u) => u.socketId === socket.id);
        if (user) {
          participants.delete(user);
          socket.to(roomId).emit("user-disconnected", user.userName, user.userRole);
          console.log(`Notified room ${roomId} of disconnection: ${user.userName} (${user.userRole})`);
          if (participants.size === 0) {
            rooms.delete(roomId);
            console.log(`Room ${roomId} deleted as it is now empty`);
          }
        }
      }
    });
  });
};
export const sendMessage = (io: Server,chatId: string,message: string,senderId: string): void => {

  if (!chatId) {
    console.error("Error: chatId is undefined");
    return;
  }

  if (!io.sockets.adapter.rooms.has(chatId)) {
    console.error(`Error: chat room ${chatId} does not exist`);
    return;
  }


  const timestamp = Date.now();
  io.to(chatId).emit("receiveMessage", { chatId, message, senderId, timestamp });
  console.log(`Message sent to chat ${chatId} from sender ${senderId}: ${message}`);
};


export { userSocketMap };