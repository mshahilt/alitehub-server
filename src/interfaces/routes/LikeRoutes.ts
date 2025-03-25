import express from "express";
import { LikeRepositoryImpl } from "../../infrastructure/repositories/LikeRepository";
import { LikeUseCase } from "../../application/useCases/LikeUseCase";
import { LikeController } from "../controllers/LikeController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const likeRepository = new LikeRepositoryImpl();
const createdLikeUseCase = new LikeUseCase(likeRepository);
const likeController = new LikeController(createdLikeUseCase);

router.use(AuthMiddleware("user"));

router
    .route("/")
    .post((req, res) => likeController.addLike(req, res))
    .delete((req, res) => likeController.removeLike(req, res));

router.get("/isLiked/:target_id", (req, res) => likeController.isLiked(req, res));
router.get("/post/:postId", (req, res) => likeController.getLikesByPost(req, res));
router.get("/user/:userId", (req, res) => likeController.getLikesByUser(req, res));
router.get("/count/:target_id", (req, res) => likeController.countLike(req, res));

export default router;
