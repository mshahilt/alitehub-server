import { Chat } from "../../domain/entities/Chat";
import ChatModel from "../database/models/ChatModel";
import { IChatRepository } from "../../application/interface/IChatRepository";
import { Types } from "mongoose";


export class ChatRepository implements IChatRepository {
    async createChat(data: Partial<Chat>): Promise<Chat> {
        const newChat = new ChatModel({
            lastMessage: data.lastMessage,
            participants: data.participants?.map(id => new Types.ObjectId(id)), // Convert strings to ObjectId
        });
    
        console.log("Before creation:", newChat);
        await newChat.save();
        return new Chat({
            id: newChat.id,
            lastMessage: newChat.lastMessage as { sentAt: Date; text: string },
            participants: newChat.participants.map(participant => participant.toString())
        })
    }

    async getChatById(id: string): Promise<Chat | null> {
        const chat = await ChatModel.findById(id);
        console.log("chat fom getchatById");
        if (!chat) {
            return null;
        }

        return new Chat({
            id: chat.id,
            lastMessage: chat.lastMessage as { sentAt: Date; text: string },
            participants: chat.participants.map(participant => participant.toString())
        });
    }


    async getChatsByParticipant(participantId: string): Promise<any[]> {
        return await ChatModel.find({ participants: { $in: [participantId] } }).populate("participants", "name email username profile_picture");
    }

    async updateChat(id: string, data: Partial<Chat>): Promise<Chat | null> {
        return await ChatModel.findOneAndUpdate({ id }, data, { new: true });
    }

    async deleteChat(id: string): Promise<boolean> {
        const result = await ChatModel.deleteOne({ id });
        return result.deletedCount > 0;
    }

}
