import express from "express";
import { CompanyController } from "../controllers/CompanyController";
import { CompanyUseCase } from "../../application/useCases/CompanyUseCase";
import { Request, Response } from "express";
import { CompanyRepositoryImpl } from "../../infrastructure/repositories/CompanyRepository";

const router = express.Router();
const userRepository = new CompanyRepositoryImpl();
const createdCompanyUseCase = new CompanyUseCase(userRepository);
const companyController = new CompanyController(createdCompanyUseCase);



export {companyController};
export default router;