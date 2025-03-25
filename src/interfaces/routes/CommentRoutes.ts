import express from "express";
import { CommentRepositoryImpl } from "../../infrastructure/repositories/CommentRepository";
import { CommentUseCase } from "../../application/useCases/CommentUseCase";
import { CommentController } from "../controllers/CommentController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const commentRepository = new CommentRepositoryImpl();
const createdCommentUseCase = new CommentUseCase(commentRepository);
const commentController = new CommentController(createdCommentUseCase);

router.post("/", AuthMiddleware("user"), async(req, res) => {
    await commentController.addComment(req, res);
})

router.get("/count/:post_id", async (req, res) => {
    await commentController.countComments(req, res);
});

router.delete("/:id", AuthMiddleware("user"), async (req, res) => {
    await commentController.deleteComment(req, res);
});

router.get("/:post_id", async (req, res) => {
    await commentController.getCommentsByPost(req, res);
});

export default router;
