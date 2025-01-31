import express from "express";
import { UserController } from "../controllers/UserController";
import { CreateUserUseCase } from "../../application/useCases/CreateUserUseCase";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepository";
import { Request, Response } from "express";

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const createUserUseCase = new CreateUserUseCase(userRepository);
const userController = new UserController(createUserUseCase);


router.post('/register', async (req: Request, res: Response) => {
    await userController.createUser(req, res);
  });
  
export default router;