import { IMessageRepository } from "../interface/IMessageRepository";
import { IChatRepository } from "../interface/IChatRepository";
import { Message } from "../../domain/entities/Message";
import { Chat } from "../../domain/entities/Chat";
import { sendMessage } from "../../infrastructure/services/SocketHandler";
import { io } from "../../app";

export class MessageUseCase {
    constructor(private messageRepository: IMessageRepository, private chatRepository: IChatRepository) {}

    async createMessage(chatId: string, content: string, senderId: string): Promise<Message> {
        try {
            const newMessage = new Message({
                chatId: chatId,
                isRead: false,
                content,
                readAt: null,
                senderId:senderId,
                sentAt: new Date(),
            });

            const savedMessage = await this.messageRepository.createMessage(newMessage);
            sendMessage(io, chatId, content, senderId);
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
