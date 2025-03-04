import mongoose, { Schema, model, Document } from 'mongoose';

interface IJob extends Document {
    jobTitle: string;
    companyName: string;
    companyId: {companyId:mongoose.Types.ObjectId, profile_picture: string};
    workplaceType: 'remote' | 'onsite' | 'hybrid';
    jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
    jobLocation: string;
    description: string;
    yearsExperienceExpecting: string;
    responsibilities: string[];
    qualifications: string[];
    skills: string[];
    postedDate: Date;
}

const jobSchema = new Schema<IJob>({
    jobTitle: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }, 
    workplaceType: {
        type: String,
        enum: ['remote', 'onsite', 'hybrid'],
        required: true,
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        required: true,
    },
    jobLocation: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    yearsExperienceExpecting: {
        type: String,
        required: true,
    },
    responsibilities: {
        type: [String],
        required: true,
    },
    qualifications: {
        type: [String],
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    postedDate: { type: Date, default: Date.now },
}, { timestamps: true });

const JobModel = model<IJob>('Job', jobSchema);

export default JobModel;
