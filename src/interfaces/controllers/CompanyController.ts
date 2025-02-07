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
            const {companyName, confirmPassword, email, otp, password, termsAccepted} = req.body;
            console.log("req.body",req.body);
            const company = await this.companyUseCase.register({name: companyName, confirmPassword: confirmPassword, otp: otp, email: email, password: password, termsAccepted: termsAccepted});
            return res.status(201).json({message: "Company created successfully", company});
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
            const company = await this.companyUseCase.companyLogin(email, password);
            return res.status(201).json({message:"Company Verfied Successfully", company});
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

        const result = await this.companyUseCase.googleAuthenticate(token);
        return res.json({company: result.company, token: result.token});
        } catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }
}