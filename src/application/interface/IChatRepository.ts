import { Chat } from "../../domain/entities/Chat";

export interface IChatRepository {
    createChat(data: Partial<Chat>): Promise<Chat>;
    getChatById(id: string): Promise<Chat | null>;
    getChatsByParticipant(participantId: string): Promise<Chat[]>;
    updateChat(id: string, data: Partial<Chat>): Promise<Chat | null>;
    deleteChat(id: string): Promise<boolean>;
}