import { Application } from "../../domain/entities/Application";
import { Job } from "../../domain/entities/Job";
import { Quiz } from "../../domain/entities/Quiz";


export interface IJobRepository {
    findAllJobs(): Promise<Job[] | null>;
    createJobs(jobDetails:Job, companyId: string):  Promise<Job | null>;
    createQuiz(jobId: string, quizQuestions:Quiz):  Promise<Quiz | null>;
    findJobById(jobId: string): Promise<Job| null>;
    findQuizByJobId(jobId: string): Promise<Quiz | null>; 
    applyForJob(userId: string, jobId: string, quizId: string, quizScore: number): Promise<Application | null>;
    updateJob(jobId: string, jobDetails: Partial<Job>): Promise<Job| null>
}