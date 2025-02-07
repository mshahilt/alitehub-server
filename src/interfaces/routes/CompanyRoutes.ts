import express from "express";
import { CompanyController } from "../controllers/CompanyController";
import { CompanyUseCase } from "../../application/useCases/CompanyUseCase";
import { Request, Response } from "express";
import { CompanyRepositoryImpl } from "../../infrastructure/repositories/CompanyRepository";

const router = express.Router();
const userRepository = new CompanyRepositoryImpl();
const createdCompanyUseCase = new CompanyUseCase(userRepository);
const companyController = new CompanyController(createdCompanyUseCase);

router.post('/register', async(req: Request, res: Response) => {
    await companyController.createCompany(req, res);
})

router.post('/login', async(req: Request, res: Response) => {
    await companyController.loginCompany(req, res);
})

router.post('/google-login', async (req: Request, res: Response) => {
    await companyController.googleAuth(req, res);
})

router.post('/generateOtp', async(req: Request, res: Response) => {
    await companyController.generateOtp(req, res);
})


export default router;