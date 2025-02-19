import { Request, Response} from "express";
import { CompanyUseCase } from "../../application/useCases/CompanyUseCase";


export class CompanyController{
    constructor (private companyUseCase: CompanyUseCase) {}

    async generateOtp(req: Request, res: Response): Promise<Response> { 
        try {
            const {email} = req.body;
            const data = await this.companyUseCase.generateOtp(email);
            return res.status(201).json({message: "Company Otp generated successfully", data})
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }

    async createCompany(req:Request, res: Response): Promise<Response> {
        try{
            const {companyName,companyIdentifier,companyType,industry,confirmPassword, email, otp, password, termsAccepted} = req.body;
            console.log("req.body",req.body);
            const response = await this.companyUseCase.register({name: companyName, confirmPassword: confirmPassword, otp: otp, email: email, password: password, termsAccepted: termsAccepted, companyIdentifier: companyIdentifier, industry: industry, companyType: companyType});
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                secure:false,
                maxAge:30*24*60*60*1000
            })
            return res.status(201).json({message: "Company created successfully", response});
        }catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }

    async loginCompany(req: Request, res: Response): Promise<Response> {
        try{
            const {email, password} = req.body;
            console.log("company email:",email,"password", password);
            const response = await this.companyUseCase.companyLogin(email, password);
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                secure:false,
                maxAge:30*24*60*60*1000
            })
            return res.status(201).json({message:"Company Verfied Successfully", response});
        }catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }
    async googleAuth(req: Request, res: Response): Promise<Response> {
        try{
        const {token} =  req.body;
        if (!token) return res.status(400).json({ message: "Token is required" });

        const response = await this.companyUseCase.googleAuthenticate(token);
        res.cookie("refreshToken", response.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure:false,
            maxAge:30*24*60*60*1000
        })
        return res.status(200).json({message:"Company Verfied Successfully",response});
        } catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }
    async fetchProfile(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.headers.authorization;
            const { companyIdentifier } = req.params;
    
            if (!token) {
                return res.status(401).json({ message: "Authorization token is missing" });
            }
    
            const data = await this.companyUseCase.fetchProfile(token, companyIdentifier);
    
            return res.status(200).json({
                message: "Profile fetched successfully",
                user: data.company,
                ownUserAcc: data.ownUserAcc,
            });
    
        } catch (error: any) {
            console.error("Error fetching profile:", error);
    
            return res.status(error.statusCode || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
    
    
      async getCompanyWithToken(req: Request, res: Response): Promise<Response> {
        try {
            console.log("fun caled")
            const token = req.headers.authorization;
            if (!token) {
                console.log("Authorization token is missing");
                return res.status(400).json({ message: "Authorization token is missing" });
            }
            const data = await this.companyUseCase.fetchCompanyUsingToken(token);
    
            return res.status(200).json({
                message: "Company data fetched successfully",
                company: data.company,
            });
        } catch (error: any) {
            console.log("Error in getCompanyWithToken:", error);
    
            return res.status(error.statusCode || 500).json({
                message: error.message || "An unknown error occurred",
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
            const response =  await this.companyUseCase.generateQuizQuestions(description, responsibilities, experienceExpecting, token);
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
            const response =  await this.companyUseCase.addJobPost(jobDetails, screeningQuiz, token);
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
    async getCompanyJobs(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.headers.authorization;
            if (!token) {
                console.log("Authorization token is missing");
                return res.status(400).json({ message: "Authorization token is missing" });
            }
            const response =  await this.companyUseCase.getCompanyJobs(token);
            return res.status(200).json({
                message: "Question generated successfully",
                jobs: response,
            });

        } catch (error: any) {
            console.log("Error in getching company jobs: ", error);
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
}