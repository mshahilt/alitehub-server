import { Company } from "../../domain/entities/Company";
import { ICompanyRepository } from "../interface/ICompanyRepository";
import bcrypt from "bcrypt";
import JwtService from "../../infrastructure/services/JwtService";
import { GoogleAuthService } from "../../infrastructure/services/googleAuthService";
import { GenerateQuizAiService } from "../../infrastructure/services/GeminiAiModelService";
import { Job } from "../../domain/entities/Job";
import { Quiz } from "../../domain/entities/Quiz";

export interface CompanyDTO {
    name: string;
    email: string;
    companyIdentifier: string;
    industry: string;
    companyType: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
    otp: string;
}
export interface CompanyResponse {
    name: string;
    email: string;
    industry: string;
    companyType: string;
    companyIdentifier: string;
    contact?: {
        phone?: string | null;
    };
    profile_picture?: string | null;
    locations?: string[] | null;
}
export interface IJob {
    jobTitle: string;
    company: string;
    workplaceType: string;
    jobType: string;
    jobLocation: string;
    description: string;
    yearsEperienceExpecting: string;
    responsibilities: string[];
    qualifications: string[];
    skills: string[];
}
export interface IQuizQuestion {
    id: string;
    question: string;
    type: "multiple" | "text" | "boolean";
    options?: string[];
    correctAnswer?: string;
}

export class CompanyUseCase {
    constructor(private companyRepository:ICompanyRepository) {}
    async generateOtp(email: string): Promise<string> {
        await this.companyRepository.generateOtp(email);
        return `otp generated for ${email}`;
    }
    async companyLogin(email: string, password: string): Promise<{ company: CompanyResponse; accessToken: string; message:string, refreshToken: string }>{
        const company = await this.companyRepository.findCompanyByEmail(email);
        if (!company) {
            throw new Error("User not found");
        }
        if (!company.password) {
            throw new Error("User password is undefined");
        }
          const isVerified = await bcrypt.compare(password, company.password);
          if(isVerified){
                const token = JwtService.generateToken(company.id, "company");
                const refreshToken = JwtService.generateRefreshToken(company.id, "company");
                const companyResponse = {name: company.name, email: company.email, companyIdentifier: company.companyIdentifier, 
                    companyType: company.companyType, industry: company.industry,locations: company.locations, profile_picture: company.profile_picture,
                };
                return {company:companyResponse, accessToken:token, message: `${company.name}'s account verified`, refreshToken};
        } else {
            throw new Error("Invalid credentials");
        }
    }
    async register(newCompany: CompanyDTO): Promise<{company: CompanyResponse, accessToken: string, refreshToken: string}> {
        
        if (newCompany.password !== newCompany.confirmPassword) {
            throw new Error("Passwords do not match");
        }
        if (!newCompany.termsAccepted) {
            throw new Error("Terms must be accepted");
        }
        const existingCompany = await this.companyRepository.findCompanyByEmail(newCompany.email);
        if(existingCompany) {
            throw new Error("User already exists");
        }
        const isOtpValid = await this.companyRepository.verifyOtp(newCompany.email, newCompany.otp);
        if(!isOtpValid) {
            throw new Error("OTP verification failed");
        }
        const hashedPassword = await bcrypt.hash(newCompany.password, 10);

        const company = new Company({
            id: Date.now().toString(),
            name: newCompany.name,
            email: newCompany.email,
            industry: newCompany.industry,
            companyIdentifier: newCompany.companyIdentifier,
            companyType: newCompany.companyType,
            password: hashedPassword
        })
        
        const createdCompany = await this.companyRepository.createCompany(company);
        if(!createdCompany.id) {
            throw new Error("Failed to create user");
        }

        const token = JwtService.generateToken(createdCompany.id, "company");
        const refreshToken = JwtService.generateRefreshToken(createdCompany.id, "company");
        const response: CompanyResponse = {name: createdCompany.name, email: createdCompany.email, companyIdentifier: createdCompany.companyIdentifier, 
            companyType: createdCompany.companyType, industry: createdCompany.industry,locations: createdCompany.locations, profile_picture: createdCompany.profile_picture,
        };

        return {company: response, accessToken:token, refreshToken};
    }
    async googleAuthenticate(token: string) {
        const googleUser = await GoogleAuthService.verifyGoogleToken(token);

        let company = await this.companyRepository.findCompanyByEmail(googleUser.email);
        if(!company) {
            throw new Error("Company with credential not exist");
        }

        const jwtToken = JwtService.generateToken(company.id, "company");
        const refreshToken = JwtService.generateRefreshToken(company.id, "company");
        const companyResponse: CompanyResponse = {name: company.name, email: company.email, companyIdentifier: company.companyIdentifier, 
            companyType: company.companyType, industry: company.industry,locations: company.locations, profile_picture: company.profile_picture,
        };
        
        return {company: companyResponse, accessToken: jwtToken, refreshToken};
    }
    async fetchProfile(
      token: string,
      companyIdentifier: string
  ): Promise<{ company: CompanyResponse; ownUserAcc: boolean }> {
      try {
          const verifiedDetails = await JwtService.verifyToken(token);
          if (!verifiedDetails) {
              throw { statusCode: 401, message: "Invalid token" };
          }
  
          if (verifiedDetails.role !== "company") {
              throw { statusCode: 400, message: "Token mismatch: Role is not 'company'" };
          }
  
          const authenticatedCompany = await this.companyRepository.findCompanyById(
              verifiedDetails.userId
          );
  
          if (!authenticatedCompany) {
              throw { statusCode: 404, message: "User not found" };
          }
  
          if (authenticatedCompany.companyIdentifier === companyIdentifier) {
              return {
                  company: authenticatedCompany,
                  ownUserAcc: true,
              };
          }
  
          const requestedCompany = await this.companyRepository.findCompanyByCompanyIdentifier(
              companyIdentifier
          );
  
          if (!requestedCompany) {
              throw { statusCode: 404, message: "Company not found" };
          }
  
          return {
              company: requestedCompany,
              ownUserAcc: false,
          };
      } catch (error: any) {
          console.error("Error in fetchProfile:", error);
  
          if (!error.statusCode) {
              error.statusCode = 401;
          }
  
          throw error; 
      }
  }
  
    async fetchCompanyUsingToken(token: string): Promise<{ company: CompanyResponse }> {
      try {
          const verifiedDetails = await JwtService.verifyToken(token);
          console.log("verifiedDetails", verifiedDetails);
          if (!verifiedDetails?.userId) {
              const error: any = new Error("Invalid or expired token");
              error.statusCode = 400; 
              throw error;
          }
          const authenticatedCompany = await this.companyRepository.findCompanyById(verifiedDetails.userId);
          console.log("authenticatedCompany", authenticatedCompany);
        
          if (!authenticatedCompany) {
              const error: any = new Error("User not found");
              error.statusCode = 404;
              throw error;
          }
  
          return { company: authenticatedCompany };
      } catch (error: any) {
          console.error("Error in fetchCompanyUsingToken:", error);
  
          if (!error.statusCode) {
              error.statusCode = 401; 
          }
  
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
    
            const responseText = await GenerateQuizAiService.generateQuestion(jobDiscription, jobResponsibilty, yearOfExperience);
            
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
            const postedJob = await this.companyRepository.createJobs(jobDetails, companyId);
            if(!postedJob) {
                return false;
            }
            const createdQuiz = await this.companyRepository.createQuiz(postedJob.id, screeningQuiz);
            if(createdQuiz) {
                return false;
            }
            
            return true;


        } catch (error) {
            console.error("Error in posting job and quiz:", error);
            throw error;
        }
    }

    async getCompanyJobs(token: string): Promise<Job[] | null> {
        try {
            const verifiedDetails = await JwtService.verifyToken(token);
            console.log("Verified user details:", verifiedDetails);
    
            if (!verifiedDetails?.userId) {
                const error: any = new Error("Invalid or expired token");
                error.statusCode = 400; 
                throw error;
            }

            const company = await this.companyRepository.findCompanyById(verifiedDetails.userId);
            if(!company) {
                const error: any = new Error("Can't find company");
                error.statusCode = 400;
                throw error;
            }
            const jobs = await this.companyRepository.findJobsOfCompanyById(company.id);
            if(jobs?.length === 0) {
                return null
            }else {
                return jobs;
            }
        } catch (error) {
            console.error("Error in fetching jobs for company:", error);
            throw error;
        }
    }
    
      
}