import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    isRead: {
        type: Boolean,
        required: true,
        default: false
    },
    content: {
        type: String,
        required: true
    },
    readAt: {
        type: Date,
        default: null
    },
    sentAt: {
        type: Date,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;
