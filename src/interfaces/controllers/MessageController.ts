import { Request, Response } from "express";
import { MessageUseCase } from "../../application/useCases/MessageUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";



export class MessageController {
    constructor(private messageUseCase: MessageUseCase) {}

    async createChat (req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.userId as string;
            let users = [userId];
            const { recieverId, lastMessage } = req.body;
            
            users.push(recieverId);
            const newChat = await this.messageUseCase.createChat(users, lastMessage);
            return res.status(201).json({ success: true, data: newChat });
        } catch (error: any) {
            console.error("Error creating chat:", error);
            res.status(500).json({ error: error.message });            
        }
    }
    async fetchChats(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.userId as string;
            const chats = await this.messageUseCase.getAllChatsByUserId(userId);
            return res.status(200).json({ success: true, data: chats});
        } catch (error: any) {
            console.error("Error fetching chat:", error);
            res.status(500).json({ error: error.message });     
        }
    }
    async fetchMessasges(req: AuthenticatedRequest, res: Response) {
        try {
            const chatId = req.params.chatId as string;
            const messages = await this.messageUseCase.getMessagesByChatId(chatId);
            return res.status(200).json({success: true, data: messages});
        }catch (error: any) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ error: error.message });
        }
    }
    async createMessage(req: AuthenticatedRequest, res: Response) {
        try {
            const {chatId, content} = req.body;
            const senderId = req.userId as string;
            const message = await this.messageUseCase.createMessage(chatId, content, senderId);
            return res.status(201).json({success: true, data: message});
        } catch (error: any) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ error: error.message });
        }
    }
}