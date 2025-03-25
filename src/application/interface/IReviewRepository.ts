import {Review} from "../../domain/entities/Review";

export interface IReviewRepository {
    addReview(review: Review): Promise<void>;
    getReviewById(reviewId: string): Promise<Review | null>;
    getReviewByCompanyId(companyId: string): Promise<Review[] | null>;
    getAllReviews(): Promise<Review[]>;
}