import { Request, Response } from "express";
import { ReviewUseCase } from "../../application/useCases/ReviewUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";


export class ReviewController {
    constructor(private reviewUseCase: ReviewUseCase) {}

    async postReview(req: AuthenticatedRequest, res: Response) {
        console.log('req.body of post review',req.body)
        const { companyId, review, rating } = req.body;
        const userId = req.userId as string;
        try {
            const newReview = await this.reviewUseCase.addReview(userId, companyId, review, rating);
            res.status(201).json(newReview);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while posting the review." });
        }
    }

    async getReviewByCompanyId(req: Request, res: Response) {
        const { companyId } = req.params;

        try {
            const reviews = await this.reviewUseCase.getReviewByCompanyId(companyId);
            res.status(200).json(reviews);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching the reviews." });
        }
    }
}
