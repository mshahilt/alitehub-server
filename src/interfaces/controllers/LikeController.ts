import { Request, Response } from "express";
import { LikeUseCase } from "../../application/useCases/LikeUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export class LikeController {
    constructor(private likeUseCase: LikeUseCase) {}
    async addLike(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { target_id, target_type } = req.body;
        try {
            const user_id = req.userId as string;
            await this.likeUseCase.addLike(target_id, user_id, target_type);
            res.status(201).send({ message: "Like added successfully" });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    async removeLike(req: Request, res: Response): Promise<void> {
        const { target_id } = req.body;
        console.log("req.body", req.body);
        try {
            await this.likeUseCase.removeLike(target_id);
            res.status(200).send({ message: "Like removed successfully" });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    async getLikesByPost(req: Request, res: Response): Promise<void> {
        const { postId } = req.params;
        try {
            const likes = await this.likeUseCase.getLikesByPost(postId);
            res.status(200).send(likes);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    async getLikesByUser(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        try {
            const likes = await this.likeUseCase.getLikesByUser(userId);
            res.status(200).send(likes);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    async countLike(req: Request, res: Response): Promise<void> {
        const { target_id } = req.params;
        try {
            const count = await this.likeUseCase.countLike(target_id);
            res.status(200).send({ count });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }

    async isLiked(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { target_id } = req.params;
        const user_id = req.userId as string;

        try {
            const status = await this.likeUseCase.isLiked(target_id, user_id);
            res.status(200).send({ status });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    }
}