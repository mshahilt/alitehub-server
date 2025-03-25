import { Message } from "../../domain/entities/Message";

export interface IMessageRepository {
    createMessage(data: Partial<Message>): Promise<Message>;
    getMessageById(id: string): Promise<Message | null>;
    getMessagesByChatId(chatId: string): Promise<Message[]>;
    markMessageAsRead(id: string, readAt: Date): Promise<Message | null>;
    deleteMessage(id: string): Promise<boolean>;
}
