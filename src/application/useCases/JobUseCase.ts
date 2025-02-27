import { Job } from "../../domain/entities/Job";
import { Quiz } from "../../domain/entities/Quiz";
import { GenerateQuizAiService } from "../../infrastructure/services/GeminiAiModelService";
import JwtService from "../../infrastructure/services/JwtService";
import { IJobRepository } from "../interface/IJobRepository";



export class JobUseCase {
    constructor(private jobRepository: IJobRepository) {}
    
  async fetchJobs(token: string): Promise<Job[] | null> {
    try {
      const jobs = await this.jobRepository.findAllJobs();
      if(jobs?.length === 0) {
        return null
      }else {
          return jobs;
      }
    } catch (error) {
      console.error("Error in fetching jobs for users:", error);
      throw error;
    }
  }

  async fetchJobById(token: string, jobId: string) {
    try {
      const verifiedDetails = await JwtService.verifyToken(token);
      if (!verifiedDetails?.userId) {
          const error: any = new Error("Invalid token");
          error.statusCode = 401;
          throw error;
      }

      const job = await this.jobRepository.findJobById(jobId);

      if (!job) {
          const error: any = new Error("Job not found");
          error.statusCode = 400;
          throw error;
      }

      return job
    } catch (error) {
      console.error("Error in fetching jobs for users:", error);
      throw error;
    }
  }

  async fetchQuizByJobId(token: string, jobId: string) {
    try {
      const verifiedDetails = await JwtService.verifyToken(token);
      if (!verifiedDetails?.userId) {
          const error: any = new Error("Invalid token");
          error.statusCode = 401;
          throw error;
      }

      const job = await this.jobRepository.findQuizByJobId(jobId);

      if (!job) {
          const error: any = new Error("Quiz not found");
          error.statusCode = 400;
          throw error;
      }

      return job
    } catch (error) {
      console.error("Error in fetching jobs for users:", error);
      throw error;
    }
  }
  async applyForJob(answers: string[], jobId: string, token: string, quizId: string) {
    try {
        const verifiedDetails = await JwtService.verifyToken(token);
        const {userId} = verifiedDetails
        if (!userId) {
            throw Object.assign(new Error("Invalid token"), { statusCode: 401 });
        }

        const quiz = await this.jobRepository.findQuizByJobId(jobId);
        if (!quiz || !quiz.questions.length) {
            throw new Error("Quiz not found or has no questions.");
        }

        const questionAnswerPairs = quiz.questions.map((q, i) => ({
            question: q.question,
            answer: answers[i] ?? null,
        }));

        const quizService = new GenerateQuizAiService();
        const AiQuizScore = await quizService.evaluateQuestionAndAnswer(questionAnswerPairs);
        const quizScore = Number(AiQuizScore.split('/')[0])
        console.log("userId", userId);
        console.log("answers", answers);
        console.log("token", token);
        console.log("quizId", quizId);

        const response = await this.jobRepository.applyForJob(userId, jobId, quizId, quizScore);
        console.log(response)

        return response;
    } catch (error) {
        console.error("Error applying for job:", error);
        throw error;
    }
  }
  async generateQuizQuestions(
        jobDiscription: string, 
        jobResponsibilty: string, 
        yearOfExperience: string, 
        token: string
    ): Promise<string[]> { 
        try {
            const verifiedDetails = await JwtService.verifyToken(token);
            console.log("Verified user details:", verifiedDetails);
    
            if (!verifiedDetails?.userId) {
                const error: any = new Error("Invalid or expired token");
                error.statusCode = 400; 
                throw error;
            }
            const quizService = new GenerateQuizAiService();
            const responseText = await quizService.generateQuestion(jobDiscription, jobResponsibilty, yearOfExperience);
            
            const quizQuestions = responseText.match(/Question \d+: (.+)/g)?.map(q => q.replace(/Question \d+: /, '').trim()) || [];
    
            console.log("Generated Quiz Questions:", quizQuestions);
            return quizQuestions;
        } catch (error: any) {
            console.error("Error in generateQuizQuestions:", error);
            throw error;
        }
    }
  
    async addJobPost(jobDetails:Job, screeningQuiz:Quiz, token: string): Promise<boolean>{
      try {
          const verifiedDetails = await JwtService.verifyToken(token);
          console.log("Verified user details:", verifiedDetails);
  
          if (!verifiedDetails?.userId) {
              const error: any = new Error("Invalid or expired token");
              error.statusCode = 400; 
              throw error;
          }
          const companyId: string = verifiedDetails.userId;
          const postedJob = await this.jobRepository.createJobs(jobDetails, companyId);
          if(!postedJob) {
              return false;
          }
          const createdQuiz = await this.jobRepository.createQuiz(postedJob.id, screeningQuiz);
          if(createdQuiz) {
              return false;
          }
          
          return true;


      } catch (error) {
          console.error("Error in posting job and quiz:", error);
          throw error;
      }
  }

  
}