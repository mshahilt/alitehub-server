import express from "express";
import { CompanyController } from "../controllers/CompanyController";
import { CompanyUseCase } from "../../application/useCases/CompanyUseCase";
import { Request, Response } from "express";
import { CompanyRepositoryImpl } from "../../infrastructure/repositories/CompanyRepository";
import { upload } from "../../infrastructure/config/multerConfig";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const companyRepository = new CompanyRepositoryImpl();
const createdCompanyUseCase = new CompanyUseCase(companyRepository);
const companyController = new CompanyController(createdCompanyUseCase);

router.get("/getCompany",AuthMiddleware("company"), async(req: Request, res: Response) => {
    await companyController.getCompanyWithToken(req, res);
})

router.get("/job/get",AuthMiddleware("company"), async(req: Request, res: Response) => {
    await companyController.getCompanyJobs(req, res);
})
router.post('/uploadProfileImage', upload.single("profileImage"), async (req: Request, res: Response) => {
    await companyController.uploadCompanyProfileImage(req, res);
});
router.put('/updateProfile', async (req, res) => {
    await companyController.updateCompanyDetails(req, res);
});

router.get('/:companyIdentifier',AuthMiddleware("company"), async (req: Request, res: Response) => {
    await companyController.fetchProfile(req, res)
})
    


export {companyController};
export default router;