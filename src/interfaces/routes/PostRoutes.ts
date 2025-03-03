import express from "express";
import { PostController } from "../controllers/PostController";
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepository";
import { PostUseCase } from "../../application/useCases/PostUseCase";


const router = express.Router();
const postRepository = new PostRepositoryImpl();
const createdPostUseCase = new PostUseCase(postRepository);
const postContcroller = new PostController(createdPostUseCase);

router
    .post("/", async (req, res) => {
        await postContcroller.createPost(req, res);
    })
    .get("/:id", async (req, res) => {
        await postContcroller.getPostById(req, res);
    })
    .get("/user/:user_id", async (req, res) => {
        await postContcroller.getPostsByUserId(req, res);
    })
    .put("/:id", async (req, res) => {
        await postContcroller.updatePost(req, res);
    })
    .delete("/:id", async (req, res) => {
        await postContcroller.deletePost(req, res);
    })
    .get("/", async (req, res) => {
        await postContcroller.getAllPosts(req, res);
    });
export default router;