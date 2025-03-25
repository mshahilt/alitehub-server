import { Review } from "../../domain/entities/Review";
import { IReviewRepository } from "../interface/IReviewRepository";


export class ReviewUseCase {
    constructor(private reviewRepository: IReviewRepository){};

    async addReview(userId: string, companyId: string, review: string, rating: number){
        try {
            const newReview = new Review({
                companyId,
                rating,
                review,
                userId
            })
            return await this.reviewRepository.addReview(newReview);
        } catch (error) {
            console.error(error)
        }
    }
    async getReviewByCompanyId(companyId: string) {
        try {
            return await this.reviewRepository.getReviewByCompanyId(companyId);
        } catch (error) {
            console.error(error)
        }
    }
}