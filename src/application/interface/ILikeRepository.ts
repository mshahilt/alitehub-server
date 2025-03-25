import { Like } from "../../domain/entities/Like";

export interface ILikeRepository {
    like(target_id: string, user_id: string, target_type: "Post" | "Comment"): Promise<Like>;
    unlike(target_id: string): Promise<boolean>;
    findByPostId(post_id:string): Promise<Like []>;
    findByUserId(user_id: string): Promise<Like []>;
    countLikes(target_id: string): Promise<number>;
    isLiked(target_id: string, user_id: string): Promise<boolean>;
}
