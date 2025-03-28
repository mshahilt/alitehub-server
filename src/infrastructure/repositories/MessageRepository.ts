import MessageModel from "../database/models/MessageModel";
import { Message } from "../../domain/entities/Message";
import { IMessageRepository } from "../../application/interface/IMessageRepository";

export class MessageRepository implements IMessageRepository {
    async createMessage(data: Partial<Message>): Promise<Message> {
        const createdMessage = await MessageModel.create(data);
        return new Message({id: createdMessage.id.toString(), chatId: createdMessage.chatId.toString(), isRead: createdMessage.isRead, readAt: createdMessage.readAt, sentAt: createdMessage.sentAt, content: createdMessage.content, senderId: createdMessage.senderId.toString()});
    }

    async getMessageById(id: string): Promise<Message | null> {
        return await MessageModel.findOne({ id });
    }

    async getMessagesByChatId(chatId: string): Promise<any[]> {
        return await MessageModel.find({ chatId }).sort({ sentAt: 1 }).populate("chatId");
        
    }

    async markMessageAsRead(id: string, readAt: Date): Promise<Message | null> {
        return await MessageModel.findOneAndUpdate({ id }, { isRead: true, readAt }, { new: true });
    }

    async deleteMessage(id: string): Promise<boolean> {
        const result = await MessageModel.deleteOne({ id });
        return result.deletedCount > 0;
    }
}
