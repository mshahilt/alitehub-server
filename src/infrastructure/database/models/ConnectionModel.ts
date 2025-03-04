import { Schema, model, Document } from "mongoose";

interface IConnection extends Document {
    userId1: Schema.Types.ObjectId;
    userId2: Schema.Types.ObjectId;
    status: 'pending' | 'accepted' | 'declined';
    requestedAt: Date;
    respondedAt: Date;
    isMutual: boolean;
}

const connectionSchema = new Schema<IConnection>({
    userId1: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    userId2: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        required: true,
    },
    requestedAt: {
        type: Date,
        required: true,
    },
    respondedAt: {
        type: Date,
    },
    isMutual: {
        type: Boolean,
        required: true,
        default: false,
    }
}, { timestamps: true });

const ConnectionModel = model<IConnection>("Connection", connectionSchema);
export default ConnectionModel;