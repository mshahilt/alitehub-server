import { PostUseCase } from "../../application/useCases/PostUseCase";
import { Request, Response } from "express";

export class PostController {
    constructor(private postUseCase: PostUseCase) {}
    async createPost(req: Request, res: Response): Promise<Response> {
        try {
            const post = req.body;
            const response = await this.postUseCase.createPost(post);
            return res.status(201).json({
                message: "Post created successfully",
                post: response,
            });
        } catch (error: any) {
            console.error("Error in creating post: ", error);
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
    async getPostById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const response = await this.postUseCase.getPostById(id);
            return res.status(200).json({
                message: "Post fetched successfully",
                post: response,
            });
        } catch (error: any) {
            console.error("Error in fetching post by id: ", error);
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
    async getPostsByUserId(req: Request, res: Response): Promise<Response> {
        try {
            const { user_id } = req.params;
            const response = await this.postUseCase.getPostsByUserId(user_id);
            return res.status(200).json({
                message: "Posts fetched successfully",
                posts: response,
            });
        } catch (error: any) {
            console.error("Error in fetching posts by user id: ", error);
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
    async updatePost(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const data = req.body;
            const response = await this.postUseCase.updatePost(id, data);
            return res.status(200).json({
                message: "Post updated successfully",
                post: response,
            });
        } catch (error: any) {
            console.error("Error in updating post: ", error);
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
    async deletePost(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const response = await this.postUseCase.deletePost(id);
            return res.status(200).json({
                message: "Post deleted successfully",
                post: response,
            });
        } catch (error: any) {
            console.error("Error in deleting post: ", error);
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
    async getAllPosts(req: Request, res: Response): Promise<Response> {
        try {
            const limit = Number(req.query.limit) || 10;
            const offset = Number(req.query.offset) || 0;
            const response = await this.postUseCase.getAllPosts(limit, offset);
            return res.status(200).json({
                message: "Posts fetched successfully",
                posts: response,
            });
        } catch (error: any) {
            console.error("Error in fetching all posts: ", error);
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
}