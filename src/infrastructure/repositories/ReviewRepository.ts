import { IReviewRepository } from "../../application/interface/IReviewRepository";
import { Review } from "../../domain/entities/Review";
import ReviewModel from "../database/models/ReviewModel";

export class ReviewRepositoryImpl implements IReviewRepository {
    async addReview(review: Review): Promise<void> {
        const reviewModel = new ReviewModel(review);
        await reviewModel.save();
    }

    async getAllReviews(): Promise<Review[]> {
        const reviews = await ReviewModel.find();
        return reviews.map(review => new Review({companyId: review.companyId.toString(), id: review.id,rating: review.rating, review: review.review, userId: review.userId.toString() }));
    }

    async getReviewByCompanyId(companyId: string): Promise<Review[] | null> {
        const reviews = await ReviewModel.find({ companyId }).exec();
        if (reviews.length === 0) {
            return null;
        }
        return reviews.map(review => new Review({companyId: review.companyId.toString(), id: review.id,rating: review.rating, review: review.review, userId: review.userId.toString() }));
    }

    async getReviewById(reviewId: string): Promise<Review | null> {
        const review = await ReviewModel.findById(reviewId).exec();
        if (!review) {
            return null;
        }
        return new Review({companyId: review.companyId.toString(), id: review.id,rating: review.rating, review: review.review, userId: review.userId.toString() });
    }
}