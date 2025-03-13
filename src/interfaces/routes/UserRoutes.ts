import express from "express";
import { UserController } from "../controllers/UserController";
import { UserUseCase } from "../../application/useCases/UserUseCase";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepository";
import { Request, Response } from "express";
import { pdfUpload } from "../../infrastructure/config/multerConfig";
import { ConnectionUseCase } from "../../application/useCases/ConnectionUseCase";
import { ConnectionRepository } from "../../infrastructure/repositories/ConnectionRepository";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const connectionRepository = new ConnectionRepository();
const connectionUseCase = new ConnectionUseCase(connectionRepository);
const createUserUseCase = new UserUseCase(userRepository);
const userController = new UserController(createUserUseCase,connectionUseCase);


router.get('/getMe',AuthMiddleware("user"), async (req: Request, res: Response) => {
    await userController.fetchUserUsingToken(req, res);
});
router.get('/users/getAllUsers', async (req: Request, res: Response) => {
    await userController.getAllUsers(req, res)
});
router.post('/updateProfile', async (req: Request, res: Response) => {
    await userController.updateProfile(req, res);
});
router.post('/uploadIntroductionVideo', async (req: Request, res: Response) => {
    await userController.uploadIntroductionVideo(req, res);
});
router.get('/getSignedUploadUrl', async (req: Request, res: Response) => {
    await userController.getSignedUploadUrl(req, res);
});
router.post('/uploadResume', pdfUpload.single("pdf"),async(req: Request, res: Response) => {
    await userController.updateResume(req, res);
})
router.get('/:username',AuthMiddleware("user"), async (req: Request, res: Response) => {
    await userController.fetchProfile(req, res)
});

export { userController }
export default router;