import { PostUseCase } from "../../application/useCases/PostUseCase";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export class PostController {
    constructor(private postUseCase: PostUseCase) {}
    async createPost(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const post = req.body;
            const user_id = req.userId;
            if(!user_id){
                return res.status(401).json({ message: "Unauthorized: No token provided" });
            }
            console.log(post);
            console.log(user_id);
            const response = await this.postUseCase.createPost(post, user_id);
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
            console.log("get posts by user id", response);  
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
    async getPostsCountByUserId(req: Request, res: Response): Promise<Response> {
        try {
            const { user_id } = req.params;
            const response = await this.postUseCase.getPostsCountByUserId(user_id);
            console.log("get posts by user id", response);  
            return res.status(200).json({
                message: "Posts fetched successfully",
                count: response,
            });
        } catch (error: any) {
            console.error("Error in fetching posts count by user id: ", error);
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
            const page = Number(req.query.page) || 1;
            const response = await this.postUseCase.getAllPosts(limit, page);
            console.log("get all posts");
            console.log("response", response);
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