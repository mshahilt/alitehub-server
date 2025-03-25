import { Comment } from "../../domain/entities/Comment";
  
export interface ICommentRepository {
    addComment(comment: Comment): Promise<Comment>;
    getCommentsByPost(post_id: string, limit: number, offset: number): Promise<Comment[]>;
    deleteComment(id: string): Promise<boolean>;
    countComments(post_id: string): Promise<number>;
}
