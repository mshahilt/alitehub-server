import express from "express";
import { userController } from "./UserRoutes";
import { companyController } from "./CompanyRoutes";
import { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    console.log("token from frontend",req.headers.authorization)
    res.status(200).json({"message" : "Server is fine buddy..!"})
})

router.post('/user/register', async (req: Request, res: Response) => {
    await userController.createUser(req, res);
})

router.get('/user/checkUsernameAvailability', async (req: Request, res: Response) => {
    await userController.checkUsernameAvailability(req, res);
})
router.post('/user/login', async (req: Request, res: Response) => {
    await userController.loginUser(req, res);
})

router.post('/user/generateOtp', async (req: Request, res: Response) => {
    await userController.generateOtp(req, res);
})
router.post('/user/google-login', async(req: Request, res: Response) => {
    await userController.googleAuth(req, res);
})
router.post('/refresh-token', async (req: Request, res: Response) => {
    await userController.refreshToken(req, res);
})


router.post('/forgot-password', async(req: Request, res: Response) => {
    await userController.forgotPassword(req, res)
})

router.post('/reset-password', async(req: Request, res: Response) => {
    await userController.resetPassword(req, res)
})

// company auth routes

router.post('/company/register', async(req: Request, res: Response) => {
    await companyController.createCompany(req, res);
})

router.post('/company/login', async(req: Request, res: Response) => {
    await companyController.loginCompany(req, res);
})

router.post('/company/google-login', async (req: Request, res: Response) => {
    await companyController.googleAuth(req, res);
})

router.post('/company/generateOtp', async(req: Request, res: Response) => {
    await companyController.generateOtp(req, res);
})

export default router;