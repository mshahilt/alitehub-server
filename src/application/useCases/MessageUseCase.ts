import { IMessageRepository } from "../interface/IMessageRepository";
import { IChatRepository } from "../interface/IChatRepository";
import { Message } from "../../domain/entities/Message";
import { Chat } from "../../domain/entities/Chat";
import { sendMessage } from "../../infrastructure/services/SocketHandler";
import { io } from "../../app";
import { sendNotification } from "../../infrastructure/config/rabbitmqConfig";
import { IUserRepository } from "../interface/IUserRepository";

export class MessageUseCase {
    constructor(private messageRepository: IMessageRepository, private chatRepository: IChatRepository,private userRepository: IUserRepository) {}
    async createMessage(chatId: string, content: string, senderId: string): Promise<Message> {
        try {
            const newMessage = new Message({
                chatId,
                isRead: false,
                content,
                readAt: null,
                senderId,
                sentAt: new Date(),
            });
    
            const savedMessage = await this.messageRepository.createMessage(newMessage);
            sendMessage(io, chatId, content, senderId);
    
            console.log("chatId : ", chatId);
            const chats = await this.chatRepository.getChatById(chatId);
            if (!chats || !chats.participants) {
                console.log("chats : ", chats);
                console.error("Chat not found or has no participants.");
                return savedMessage;
            }
    
            const user = await this.userRepository.findById(senderId);
            if (!user) {
                throw new Error("User not found");
            }
            const { username } = user; 
            const receiverIds = chats.participants.filter((user) => user !== senderId);
            console.log("Receiver IDs:", receiverIds);
    
            await Promise.all(receiverIds.map(async (receiverId) => {
                await sendNotification({
                    receiverId,
                    senderId,
                    type: "connection_request",
                    message: `${username} sent you "${content}".`,
                });
            }));
    
            return savedMessage;
        } catch (error) {
            console.error("Error creating message:", error);
            throw error;
        }
    }
    

    async getMessageById(id: string): Promise<Message | null> {
        try {
            return await this.messageRepository.getMessageById(id);
        } catch (error) {
            console.error("Error getting message by ID:", error);
            throw error;
        }
    }

    async getMessagesByChatId(chatId: string): Promise<Message[]> {
        try {
            return await this.messageRepository.getMessagesByChatId(chatId);
        } catch (error) {
            console.error("Error getting messages by chat ID:", error);
            throw error;
        }
    }

    async markMessageAsRead(id: string, readAt: Date): Promise<Message | null> {
        try {
            return await this.messageRepository.markMessageAsRead(id, readAt);
        } catch (error) {
            console.error("Error marking message as read:", error);
            throw error;
        }
    }

    async deleteMessage(id: string): Promise<boolean> {
        try {
            return await this.messageRepository.deleteMessage(id);
        } catch (error) {
            console.error("Error deleting message:", error);
            throw error;
        }
    }

    async createChat(usersId: string[], lastMessageText: string) {
        try {
            const newChat = new Chat({
                participants: usersId,
                lastMessage: {
                    sentAt: new Date(),
                    text: lastMessageText
                }
            });
            return await this.chatRepository.createChat(newChat);
        } catch (error) {
            console.error("Error creating chat:", error);
            throw error;
        }
    }

    async getAllChatsByUserId(userId: string): Promise<Chat[]> {
        try {
            const chat = await this.chatRepository.getChatsByParticipant(userId);
            return chat;
        } catch (error) {
            console.error("Error getting all chats by user ID:", error);
            throw error;
        }
    }
}
