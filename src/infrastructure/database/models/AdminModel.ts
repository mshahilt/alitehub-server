import mongoose, { Document, Schema, Model } from "mongoose";

interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
}

const adminSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

const AdminModel: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);

export default AdminModel;
