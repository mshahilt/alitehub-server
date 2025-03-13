import ApplicationModel from "../database/models/ApplicationModel";
import { Application } from "../../domain/entities/Application";
import { IApplicationRepository } from "../../application/interface/IApplicationRepository";
import mongoose from "mongoose";


export class ApplicationRepositoryImpl implements IApplicationRepository {
    async fetchAllApplications(): Promise<Application[]> {
        const applications = await ApplicationModel.find().populate(['user_id', 'job_id']);
    
        return applications.map(app => new Application({
            id: app._id,
            job_id: app.job_id,
            user_id: app.user_id,
            status: app.status,
            quiz_score: app.quiz_score,
            quiz_id: app.quiz_id
        }));
    }
    
    async fetchApplicationsByCompanyId(companyId: string): Promise<Application[] | null> {

        const applications = await ApplicationModel.aggregate([
            {
                $lookup: {
                    from: "jobs", 
                    localField: "job_id",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            {
                $unwind: "$jobDetails"
            },
            {
                $match: {
                    "jobDetails.companyId": new mongoose.Types.ObjectId(companyId)
                }
            },
            {
                $lookup: {
                    from:"users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            }
        ]);
        console.log("applications", applications)

        return applications;
    }
    async fetchApplicationsByUserId(userId: string): Promise<Application[] | null> {
        const applications = await ApplicationModel.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "jobs", 
                    localField: "job_id",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            {
                $unwind: "$jobDetails"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            }
            
        ]);
    
        console.log("applications for fetchApplicationsByUserId", applications);
        return applications;
    }
    

    async fetchApplicationById(applicationId: string): Promise<Application | null> {
        const applications = await ApplicationModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(applicationId)
                }
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "job_id",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            { $unwind: "$jobDetails" },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "calls",
                    localField: "interview",
                    foreignField: "_id",
                    as: "interviewDetails"
                }
            },
            { 
                $unwind: { 
                    path: "$interviewDetails", 
                    preserveNullAndEmptyArrays: true 
                } 
            }
        ]);
    
        if (!applications.length) return null;

        return applications[0];
    }
    
    async createApplication(applicationData: Application): Promise<Application | null> {
        const application = new ApplicationModel(applicationData);

        const savedApplication = await application.save();
        
    return new Application({
        id: savedApplication._id,
        job_id: savedApplication.job_id,
        user_id: savedApplication.user_id,
        status: savedApplication.status,
        quiz_score: savedApplication.quiz_score,
        quiz_id: savedApplication.quiz_id
    });
    }
    async updateApplication(applicationId: string, updateData: Partial<Application>): Promise<Application | null> {
        const updatedApplication = await ApplicationModel.findByIdAndUpdate(
                applicationId,
                { $set: updateData },
                { new: true, upsert: true }
            );
    
            if (!updatedApplication) return null;
    
            return new Application({
                id: updatedApplication._id,
                job_id: updatedApplication.job_id,
                user_id: updatedApplication.user_id,
                status: updatedApplication.status,
                quiz_score: updatedApplication.quiz_score,
                quiz_id: updatedApplication.quiz_id
            });
    }

}