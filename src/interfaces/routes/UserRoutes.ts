import express from "express";
import { UserController } from "../controllers/UserController";
import { UserUseCase } from "../../application/useCases/UserUseCase";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepository";
import { Request, Response } from "express";

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const createUserUseCase = new UserUseCase(userRepository);
const userController = new UserController(createUserUseCase);


router.get('/getMe', async (req: Request, res: Response) => {
    await userController.fetchUserUsingToken(req, res);
});
router.get('/users/getAllUsers', async (req: Request, res: Response) => {
    await userController.getAllUsers(req, res)
});
router.post('/updateProfile', async (req: Request, res: Response) => {
    await userController.updateProfile(req, res);
});
router.get('/jobs', async (req: Request, res: Response) => {
    await userController.fetchJobs(req, res);
});
router.get('/:username', async (req: Request, res: Response) => {
    await userController.fetchProfile(req, res)
});

export { userController }
export default router;