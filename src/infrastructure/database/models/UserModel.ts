import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    username: string;
    contact?: {
        phone?: string | null;
    };
    profile_picture?: string | null;
    resume_url: string | null;
    video_url: string | null;
    isBlocked: boolean;
    education?: {
        degree?: string | null;
        end_date?: string | null;
        institution?: string | null;
        start_date?: string | null;
    }[];
    job_preference?: object;
    job_types?: string[] | null;
    industries?: string[] | null;
    locations?: string[] | null;
    skills?: string[] | null;
    created_at?: Date | null;
    updated_at?: Date | null;
    is_active?: boolean | null;
    experience?: {
        company?: string | null;
        description?: string | null;
        end_date?: string | null;
        start_date?: string | null;
        title?: string | null;
    }[];
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        password: { type: String },
        username: { type: String, required: true, unique: true },
        email:{type: String, required: true, unique: true},
        contact: {
            phone: { type: String, default: null },
        },
        profile_picture: { type: String, default: null },
        resume_url: {type: String, default: null},
        video_url: {type: String, default: null},
        isBlocked: {type: Boolean, default: false},
        education: [
            {
                degree: { type: String, default: null },
                end_date: { type: String, default: null },
                institution: { type: String, default: null },
                start_date: { type: String, default: null },
            },
        ],
        job_preference: { type: Object, default: {} },
        job_types: [{ type: String, default: null }],
        industries: [{ type: String, default: null }],
        locations: [{ type: String, default: null }],
        skills: [{ type: String, default: null }],
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        is_active: { type: Boolean, default: true },
        experience: [
            {
                company: { type: String, default: null },
                description: { type: String, default: null },
                end_date: { type: String, default: null },
                start_date: { type: String, default: null },
                title: { type: String, default: null },
            },
        ],
    },
    { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
