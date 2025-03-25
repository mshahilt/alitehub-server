import mongoose, { Schema, Types } from "mongoose";

const chatSchema = new Schema({
    lastMessage: {
        sentAt: {
            type: Date,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    },
    participants: [{
        type: Types.ObjectId, 
        ref: "User", 
        required: true
    }]
}, { timestamps: true });

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;
