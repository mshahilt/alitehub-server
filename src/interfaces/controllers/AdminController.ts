import { Request, Response } from "express";
import { AdminUseCase } from "../../application/useCases/AdminUseCase";


export class AdminController {
    constructor(private adminUseCase: AdminUseCase) {}

    async adminLogin(req: Request, res: Response): Promise<Response> {
        try {
            const {email, password} =  req.body;
            const data = await this.adminUseCase.adminLogin(email, password);
            return res.status(200).json({message: "Admin verified Successfully", data})
        } catch (error:any) {
            return res.status(400).json({message: error.message});
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.adminUseCase.fetchAllUsers();
            return res.status(200).json({message: "Users data fetched successfully", users});
        } catch (error: any) {
            return res.status(400).json({message: error.message});
        }
    }

    async getAllcompanies(req: Request, res: Response): Promise<Response> {
        try {
            const companies = await this.adminUseCase.fetchAllCompanies();
            return res.status(200).json({message: "Companies data fetched successfully", companies});
        } catch (error: any) {
            return res.status(400).json({message: error.message});
        }
    }

    async blockOrUnblockUser(req: Request, res: Response): Promise<Response> {
        try {
            const {userId} = req.params;
            const user = await this.adminUseCase.blockOrUnnlockUser(userId);
            return res.status(200).json({message: "Updated block status of user", user});
        } catch (error: any) {
            return res.status(400).json({message: error.message});
        }
    }
    async blockOrUnblockCompany(req: Request, res: Response): Promise<Response> {
        try {
            const {companyId} = req.params;
            const company = await this.adminUseCase.blockOrUnblockCompany(companyId);
            return res.status(200).json({message: "Updated block status of company", company});
        } catch (error: any) {
            return res.status(400).json({message: error.message});
        }
    }
}