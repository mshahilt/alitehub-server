import express from "express";
import { UserController } from "../controllers/UserController";
import { UserUseCase } from "../../application/useCases/UserUseCase";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepository";
import { Request, Response } from "express";

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const createUserUseCase = new UserUseCase(userRepository);
const userController = new UserController(createUserUseCase);


router.post('/register', async (req: Request, res: Response) => {
    await userController.createUser(req, res);
})
router.get('/checkUsernameAvailability', async (req: Request, res: Response) => {
    await userController.checkUsernameAvailability(req, res);
})
router.post('/generateOtp', async (req: Request, res: Response) => {
    await userController.generateOtp(req, res);
})



  
export default router;