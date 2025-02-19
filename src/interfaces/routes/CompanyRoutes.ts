import express from "express";
import { CompanyController } from "../controllers/CompanyController";
import { CompanyUseCase } from "../../application/useCases/CompanyUseCase";
import { Request, Response } from "express";
import { CompanyRepositoryImpl } from "../../infrastructure/repositories/CompanyRepository";

const router = express.Router();
const companyRepository = new CompanyRepositoryImpl();
const createdCompanyUseCase = new CompanyUseCase(companyRepository);
const companyController = new CompanyController(createdCompanyUseCase);

router.get("/getCompany", async(req: Request, res: Response) => {
    await companyController.getCompanyWithToken(req, res);
})
router.post("/job/generateQuizQuestions", async(req: Request, res: Response) => {
    await companyController.generateQuizQuestions(req, res);
})
router.post("/job/add", async(req: Request, res: Response) => {
    await companyController.addJobPost(req, res);
})
router.get("/job/get", async(req: Request, res: Response) => {
    await companyController.getCompanyJobs(req, res);
})
router.get('/:companyIdentifier', async (req: Request, res: Response) => {
    await companyController.fetchProfile(req, res)
})
    


export {companyController};
export default router;