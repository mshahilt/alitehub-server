import JobModel from "../database/models/JobModel";
import { Job } from "../../domain/entities/Job";
import { IJobRepository } from "../../application/interface/IJobRepository";
import QuizModel from "../database/models/QuizModel";
import { Quiz } from "../../domain/entities/Quiz";
import { Application } from "../../domain/entities/Application";
import ApplicationModel from "../database/models/ApplicationModel";
import mongoose from "mongoose";



export class JobRepositoryImpl implements IJobRepository {
    async findAllJobs(): Promise<Job[] | null> {
        const jobs = await JobModel.find().populate({
            path: "companyId",
            select: "profile_picture",
        });
        return jobs ? jobs.map(job => new Job({ id: job.id,jobTitle:job.jobTitle, company: job.companyName, workplaceType: job.workplaceType, postedDate: job.postedDate, company_profile: job.companyId.profile_picture })) : null
    }
    async findJobById(jobId: string): Promise<Job | null> {
        try {
            const job = await JobModel.findById(jobId);
            return job ? new Job({ id: job.id,jobTitle:job.jobTitle, company: job.companyName, company_profile: job.companyId.profile_picture, workplaceType: job.workplaceType,jobType: job.jobType, jobLocation: job.jobLocation ,postedDate: job.postedDate,
                description: job.description, yearsExperienceExpecting: job.yearsExperienceExpecting, responsibilities: job.responsibilities, qualifications: job.qualifications, skills: job.skills
            }) : null;
        } catch (error) {
            throw error
        }
    }

    async findQuizByJobId(jobId: string): Promise<Quiz | null> {
        try {
            const quiz = await QuizModel.findOne({jobId: jobId});
            return quiz ? new Quiz({id:quiz.id ,questions: quiz.questions}) : null;
        } catch (error) {
            throw error
        }
    }
    async applyForJob(userId: string, jobId: string, quizId: string, quizScore: number) {
        try {
            const application = new ApplicationModel({
                user_id: new mongoose.Types.ObjectId(userId),
                job_id: new mongoose.Types.ObjectId(jobId),
                quiz_id: new mongoose.Types.ObjectId(quizId),
                status: "pending",
                quiz_score: quizScore
            });
    
            await application.save();
    
            return application 
                ? new Application({
                    id: application.id,
                    job_id: application.job_id,
                    quiz_score: application.quiz_score,
                    quiz_id: application.quiz_id
                }) 
                : null;
        } catch (error) {
            throw error;
        }
    }
    async createJobs(jobDetails: Job, companyId: string): Promise<Job | null> {
        try {
            console.log('sdfsd',companyId)
            const job = await JobModel.create({
                jobTitle: jobDetails.jobTitle,
                companyName: jobDetails.company,
                companyId: companyId,
                workplaceType: jobDetails.workplaceType,
                jobType: jobDetails.jobType,
                jobLocation: jobDetails.jobLocation,
                description: jobDetails.description,
                yearsExperienceExpecting: jobDetails.yearsExperienceExpecting,
                responsibilities: jobDetails.responsibilities,
                qualifications: jobDetails.qualifications,
                skills: jobDetails.skills
            });
    
            return job ? new Job({ id: job.id,jobTitle:job.jobTitle, company: job.companyName, workplaceType: job.workplaceType }) : null;
        } catch (error) {
            console.error('Error creating job:', error);
            return null;
        }
    }
    async createQuiz(jobId: string, quizQuestions: Quiz): Promise<Quiz | null> {
        try {
            const quiz = await QuizModel.create({
                questions: quizQuestions,
                jobId: jobId,
            })
            return quiz ? new Quiz({id: quiz.id, jobId: quiz.jobId}) : null
        } catch (error) {
            console.error('Error creating quiz:', error);
            return null;
        }
    }
    async updateJob(jobId: string, jobDetails: Partial<Job>): Promise<Job | null> {
        try {
            console.log("jobID",jobId);
            console.log("jobDetails",jobDetails);
            const updatedJob = await JobModel.findByIdAndUpdate(jobId, jobDetails, { new: true });
            return updatedJob ? new Job({
                id: updatedJob.id,
                jobTitle: updatedJob.jobTitle,
                company: updatedJob.companyName,
                company_profile: updatedJob.companyId.profile_picture,
                workplaceType: updatedJob.workplaceType,
                jobType: updatedJob.jobType,
                jobLocation: updatedJob.jobLocation,
                postedDate: updatedJob.postedDate,
                description: updatedJob.description,
                yearsExperienceExpecting: updatedJob.yearsExperienceExpecting,
                responsibilities: updatedJob.responsibilities,
                qualifications: updatedJob.qualifications,
                skills: updatedJob.skills
            }) : null;
        } catch (error) {
            console.error('Error updating job:', error);
            return null;
        }
    }
}