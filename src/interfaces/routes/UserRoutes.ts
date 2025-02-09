import express from "express";
import { UserController } from "../controllers/UserController";
import { UserUseCase } from "../../application/useCases/UserUseCase";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepository";
import { Request, Response } from "express";

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const createUserUseCase = new UserUseCase(userRepository);
const userController = new UserController(createUserUseCase);



router.get('/:username', async (req: Request, res: Response) => {
    await userController.fetchProfile(req, res)
})



export { userController }
export default router;