import { Like } from "../../domain/entities/Like";
import { ILikeRepository } from "../interface/ILikeRepository";

export class LikeUseCase {
    constructor(private likeRepository: ILikeRepository) {}

    async addLike(target_id: string, user_id: string, target_type: "Post" | "Comment"): Promise<void> {
        try {
            await this.likeRepository.like(target_id, user_id, target_type);
        } catch (error: any) {
            throw new Error(`Failed to add like: ${error.message}`);
        }
    }

    async removeLike(target_id: string): Promise<void> {
        try {
            await this.likeRepository.unlike(target_id);
        } catch (error: any) {
            throw new Error(`Failed to remove like: ${error.message}`);
        }
    }

    async getLikesByPost(postId: string): Promise<Like[]> {
        try {
            return await this.likeRepository.findByPostId(postId);
        } catch (error: any) {
            throw new Error(`Failed to get likes by post: ${error.message}`);
        }
    }

    async getLikesByUser(userId: string): Promise<Like[]> {
        try {
            return await this.likeRepository.findByUserId(userId);
        } catch (error: any) {
            throw new Error(`Failed to get likes by user: ${error.message}`);
        }
    }

    async countLike(target_id: string): Promise<number> {
        try {
            return await this.likeRepository.countLikes(target_id);
        } catch (error: any) {
            throw new Error(`Failed to count likes: ${error.message}`);
        }
    }
    async isLiked(target_id: string, user_id: string): Promise<boolean> {
        try {
            return await this.likeRepository.isLiked(target_id, user_id);
        } catch (error: any) {
            throw new Error(`Failed to check if liked: ${error.message}`);
        }
    }
}