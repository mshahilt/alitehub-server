import { Request, Response } from "express";
import { JobUseCase } from "../../application/useCases/JobUseCase";


export class JobController {
    constructor(private jobUseCase: JobUseCase){}
    
    async fetchJobs(req:Request, res: Response): Promise<Response> {
        try {
            const token: string = req.headers.authorization as string;
            const response = await this.jobUseCase.fetchJobs(token);
            return res.status(200).json({
                message: "Jobs fetched successfully",
                jobs: response,
            });
        } catch (error: any) {
            console.log("Error in getching company jobs: ", error);
    
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
    async fetchJobById(req: Request, res: Response){
        try {
            const token = req.headers.authorization;
            const { jobId } = req.params;
    
    
            if (!token) {
                return res.status(401).json({ message: "Authorization token is missing" });
            }
    
            const data = await this.jobUseCase.fetchJobById(token, jobId);
    
            return res.status(200).json({
                message: "Job fetched successfully",
                job: data,
            });
    
        } catch (error: any) {
            console.error("Error in fetch job by id controller:", error);
            return res.status(error.statusCode || 500).json({
                message: error.message || "An unknown error occurred"
            });
        }
    }
    async fetchQuizByJobId(req: Request, res: Response) {
        try {
            const token = req.headers.authorization;
            const { jobId } = req.params;
    
    
            if (!token) {
                return res.status(401).json({ message: "Authorization token is missing" });
            }
    
            const data = await this.jobUseCase.fetchQuizByJobId(token, jobId);
    
            return res.status(200).json({
                message: "Job fetched successfully",
                quiz: data,
            });
        } catch (error: any) {
            console.error("Error in fetch job by id controller:", error);
            return res.status(error.statusCode || 500).json({
                message: error.message || "An unknown error occurred"
            });
        }
    }
    async applyForJob(req: Request, res: Response) {
        try {
            const { answers, jobId, quizId } = req.body;
            console.log("quizId req.body", quizId)
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ message: "Authorization token is missing" });
            }

            const response = await this.jobUseCase.applyForJob(answers, jobId, token, quizId);
            return res.status(200).json({
                success: true,
                message: "Job applied successfully",
                appliedJob: response,
            });
        } catch (error: any) {
            console.error("Error in applying job with answerd:", error);
            return res.status(error.statusCode || 500).json({
                message: error.message || "An unknown error occurred"
            });
        }
    }
    
    async generateQuizQuestions(req: Request, res: Response):Promise<Response> {
        try {
            console.log("generate quiz called");
            const token = req.headers.authorization;
            if (!token) {
                console.log("Authorization token is missing");
                return res.status(400).json({ message: "Authorization token is missing" });
            }
            const {responsibilities, description, experienceExpecting} = req.body;
            console.log(req.body)
            const response =  await this.jobUseCase.generateQuizQuestions(description, responsibilities, experienceExpecting, token);
            return res.status(200).json({
                message: "Question generated successfully",
                questions: response,
            });
        } catch (error: any) {
            console.log("Error in generating quiz questions:", error);
    
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }

    async addJobPost(req: Request, res: Response): Promise<Response> {
        try {
            console.log("generate quiz called");
            const token = req.headers.authorization;
            if (!token) {
                console.log("Authorization token is missing");
                return res.status(400).json({ message: "Authorization token is missing" });
            }
            const {jobDetails, screeningQuiz} = req.body;
            console.log(req.body)
            const response =  await this.jobUseCase.addJobPost(jobDetails, screeningQuiz, token);
            return res.status(200).json({
                message: "Question generated successfully",
                questions: response,
            });
        }catch (error: any) {
            console.log("Error in posting new job: ", error);
    
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
    async updateJob(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.headers.authorization;
            const { jobId } = req.params;
            console.log("req.body of update job", req.body);
            const {jobDetails} = req.body;

            if (!token) {
                return res.status(401).json({ message: "Authorization token is missing" });
            }

            const response = await this.jobUseCase.updateJob(jobId, jobDetails, token);
            return res.status(200).json({
                message: "Job updated successfully",
                job: response,
            });
        } catch (error: any) {
            console.error("Error in updating job:", error);
            return res.status(error.statusCode || 500).json({
                message: error.message || "An unknown error occurred"
            });
        }
    }

    async fetchSkills(req: Request, res: Response): Promise<Response> {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({ error: "Query parameter is required" });
            }

            const token = await this.jobUseCase.getAccessTokenForSkills();
            const response = await this.jobUseCase.fetchSkills(query as string, token);

            return res.status(200).json(response.data);
        } catch (error: any) {
            console.error("Error fetching skills:", error.response?.data || error.message);
            return res.status(500).json({ error: "Failed to fetch skills" });
        }
    }
     

}