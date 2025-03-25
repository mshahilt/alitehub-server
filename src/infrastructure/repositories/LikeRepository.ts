import { ILikeRepository } from "../../application/interface/ILikeRepository";
import LikeModel from "../database/models/LikeModel";
import { Like } from "../../domain/entities/Like";

export class LikeRepositoryImpl implements ILikeRepository {
    async like(target_id: string, user_id: string, target_type: "Post" | "Comment"): Promise<Like> {
        const existingLike = await LikeModel.findOne({ target_id, user_id });
        if (existingLike) return new Like({ id: existingLike.id, target_id: existingLike.target_id.toString(), user_id: existingLike.user_id.toString(), target_type: existingLike.target_type, time: existingLike.time });

        const newLike = new LikeModel({ target_id, user_id, target_type });
        const savedLike = await newLike.save();
        return new Like({ id: savedLike.id, target_id: savedLike.target_id.toString(), user_id: savedLike.user_id.toString(), target_type: savedLike.target_type, time: savedLike.time });
    }

    async unlike(target_id: string): Promise<boolean> {
        const result = await LikeModel.findOneAndDelete({ target_id });
        return result !== null;
    }

    async findByPostId(post_id: string): Promise<Like[]> {
        const likes = await LikeModel.find({ target_id: post_id, target_type: "Post" });
        return likes.map(like => new Like({ id: like.id, target_id: like.target_id.toString(), user_id: like.user_id.toString(), target_type: like.target_type, time: like.time }));
    }
    async findByUserId(user_id: string): Promise<Like[]> {
        const likes = await LikeModel.find({ user_id });
        return likes.map(like => new Like({ id: like.id, target_id: like.target_id.toString(), user_id: like.user_id.toString(), target_type: like.target_type, time: like.time }));
    }
    async countLikes(target_id: string): Promise<number> {
        return await LikeModel.countDocuments({ target_id });
    }

    async isLiked(target_id: string, user_id: string): Promise<boolean> {
        return await LikeModel.exists({ target_id, user_id }) !== null;
    }
}
