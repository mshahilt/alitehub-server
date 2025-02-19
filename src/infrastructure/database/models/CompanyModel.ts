import mongoose, { Schema, Document } from 'mongoose';

interface ICompany extends Document {
    name: string;
    email: string;
    password?: string;
    industry: string;
    companyType: string;
    companyIdentifier: string;
    contact?: {
        phone?: string | null;
    };
    profile_picture?: string | null;
    locations?: string[] | null;
}

const CompanySchema: Schema = new Schema<ICompany>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    industry: {type: String, required: true},
    companyType:{type: String, required: true},
    companyIdentifier: {type: String, required: true},
    contact: {
        phone: { type: String, default: null }
    },
    profile_picture: { type: String, default: null },
    locations: { type: [String], default: null }
}, {
    timestamps: true
});

const CompanyModel = mongoose.model<ICompany>('Company', CompanySchema);

export default CompanyModel;
