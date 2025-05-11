import express from "express";
import { AdminController } from "../controllers/AdminController";
import { AdminUseCase } from "../../application/useCases/AdminUseCase";
import { Request, Response } from "express";
import { AdminRepositoryImpl } from "../../infrastructure/repositories/AdminRespository";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const adminRepository = new AdminRepositoryImpl();
const cretedAdminUseCase = new AdminUseCase(adminRepository);
const adminController = new AdminController(cretedAdminUseCase);

router.post("/login", async(req: Request, res: Response) => {
    await adminController.adminLogin(req, res);
})

router.post('/createPlan', async(req: Request, res: Response) => {
    await adminController.createPlan(req, res);
})

router.get("/getUsers",AuthMiddleware("admin"), async(req: Request, res: Response) => {
    await adminController.getAllUsers(req, res);
})

router.get("/getCompanies",AuthMiddleware("admin"), async(req: Request, res: Response) => {
    await adminController.getAllcompanies(req, res);
})
router.patch('/blockOrUnblockUser/:userId',AuthMiddleware("admin"), async(req: Request, res: Response) => {
    await adminController.blockOrUnblockUser(req, res);
})

router.patch('/blockOrUnblockCompany/:companyId',AuthMiddleware("admin"), async(req: Request, res: Response) => {
    await adminController.blockOrUnblockCompany(req, res);
})

export{adminController};
export default router;