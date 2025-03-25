import { Request, Response } from "express";
import { CommentUseCase } from "../../application/useCases/CommentUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";


export class CommentController {
    constructor(private commentUseCase: CommentUseCase) {}

    async addComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { post_id, content } = req.body;
            console.log("req.body of add comment", req.body);
            const user_id = req.userId as string;
            const comment = await this.commentUseCase.addComment(post_id, user_id, content);
            return res.status(201).json(comment);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async countComments(req: Request, res: Response): Promise<Response> {
        try {
            const { post_id } = req.params;
            const count = await this.commentUseCase.countComments(post_id);
            return res.status(200).json({ count });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const success = await this.commentUseCase.deleteComment(id);
            if (success) {
                return res.status(200).json({ message: "Comment deleted successfully" });
            } else {
                return res.status(404).json({ message: "Comment not found" });
            }
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getCommentsByPost(req: Request, res: Response): Promise<Response> {
        try {
            const { post_id } = req.params;
            const { limit, offset } = req.query;
            const comments = await this.commentUseCase.getCommentsByPost(post_id, Number(limit), Number(offset));
            return res.status(200).json(comments);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}