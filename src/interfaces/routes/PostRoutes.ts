import express from "express";
import { PostController } from "../controllers/PostController";
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepository";
import { PostUseCase } from "../../application/useCases/PostUseCase";
import { AuthMiddleware } from "../middlewares/authMiddleware"; 

const router = express.Router();
const postRepository = new PostRepositoryImpl();
const createdPostUseCase = new PostUseCase(postRepository);
const postController = new PostController(createdPostUseCase);

router
    .post("/", AuthMiddleware("user"), async (req, res) => {
        await postController.createPost(req, res);
    })
    .get("/", AuthMiddleware("user"), async (req, res) => {
        await postController.getAllPosts(req, res);
    })
    .get("/:id", AuthMiddleware("user"), async (req, res) => {
        await postController.getPostById(req, res);
    })
    .get("/user/:user_id/count", AuthMiddleware("user"), async (req, res) => {
        await postController.getPostsCountByUserId(req, res);
    })
    .get("/user/:user_id", AuthMiddleware("user"), async (req, res) => {
        await postController.getPostsByUserId(req, res);
    })
    .put("/:id", AuthMiddleware("user"), async (req, res) => {
        await postController.updatePost(req, res);
    })
    .delete("/:id", AuthMiddleware("user"), async (req, res) => {
        await postController.deletePost(req, res);
    });

export default router;
