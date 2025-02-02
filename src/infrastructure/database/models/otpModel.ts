import { Schema, model, Document } from 'mongoose';

interface IOtp extends Document {
    code: string;
    email: string;
    createdAt: Date;
    expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
    code: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

const otpModel = model<IOtp>('Otp', otpSchema);

export default otpModel;