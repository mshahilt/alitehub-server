import express from "express";
import { UserController } from "../controllers/UserController";
import { UserUseCase } from "../../application/useCases/UserUseCase";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepository";
import { Request, Response } from "express";
import passport from "../../infrastructure/config/googleAuth";

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const createUserUseCase = new UserUseCase(userRepository);
const userController = new UserController(createUserUseCase);


router.post('/register', async (req: Request, res: Response) => {
    await userController.createUser(req, res);
})
router.post('/login', async (req: Request, res: Response) => {
    await userController.loginUser(req, res);
})
router.get('/checkUsernameAvailability', async (req: Request, res: Response) => {
    await userController.checkUsernameAvailability(req, res);
})
router.post('/generateOtp', async (req: Request, res: Response) => {
    await userController.generateOtp(req, res);
})
router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req: Request, res: Response) => {
        await userController.googleAuth(req, res);
    }
);


  
export default router;