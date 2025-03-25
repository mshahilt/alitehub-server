import { Comment } from "../../domain/entities/Comment";
import { ICommentRepository } from "../interface/ICommentRepository";


export class CommentUseCase {
    constructor(private commentRepository: ICommentRepository) {}
    async addComment(post_id: string, user_id: string, content: string): Promise<Comment> {
        const newComment = new Comment({
            content: content,
            post_id: post_id,
            time: new Date(),
            user_id: user_id
        })
        return await this.commentRepository.addComment(newComment);
    }

    async countComments(post_id: string): Promise<number> {
        return await this.commentRepository.countComments(post_id);
    }

    async deleteComment(id: string): Promise<boolean> {
        return await this.commentRepository.deleteComment(id);
    }

    async getCommentsByPost(post_id: string, limit: number, offset: number): Promise<Comment[]> {
        return await this.commentRepository.getCommentsByPost(post_id, limit, offset);
    }
}