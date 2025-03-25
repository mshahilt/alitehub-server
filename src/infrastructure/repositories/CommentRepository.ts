import { ICommentRepository } from "../../application/interface/ICommentRepository";
import CommentModel from "../database/models/CommentModel";
import { Comment } from "../../domain/entities/Comment";

export class CommentRepositoryImpl implements ICommentRepository {
    async addComment(comment: Comment): Promise<Comment> {
        const newComment = new CommentModel(comment);
        await newComment.save();
        return new Comment({content: newComment.content});
    }

    async countComments(post_id: string): Promise<number> {
        return await CommentModel.countDocuments({ post_id });
    }

    async deleteComment(id: string): Promise<boolean> {
        const result = await CommentModel.findByIdAndDelete(id);
        return result !== null;
    }

    async getCommentsByPost(
        post_id: string, 
        limit: number, 
        offset: number
      ): Promise<(Comment & { user: { username: string; name: string } })[]> {
        
        const comments = await CommentModel.find({ post_id })
          .populate({ path: "user_id", select: "username name" }) 
          .skip(offset)
          .limit(limit)
          .exec();
      
        return comments.map((comment) => ({
          id: comment.id,
          post_id: comment.post_id.toString(),
          content: comment.content,
          time: comment.time,
          user_id: comment.user_id.toString(),
          replies: [],
          user: {
            username: (comment.user_id as any)?.username,
            name: (comment.user_id as any)?.name
          }
        }));
      }
      

   
}