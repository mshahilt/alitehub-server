import { IPostRepository } from "../../application/interface/IPostRepository";
import { Post } from "../../domain/entities/Post";
import PostModel from "../database/models/PostModel";

export class PostRepositoryImpl implements IPostRepository {
    async create(post: Post): Promise<Post> {
        const newPost = new PostModel(post);
        const savedPost = await newPost.save();

        return new Post({id: savedPost.id, media: savedPost.media, title: savedPost.title, tags: savedPost.tags, time: savedPost.time})
    }

    async findById(id: string): Promise<Post | null> {
        return await PostModel.findById(id);
    }

    async findByUserId(user_id: string): Promise<Post[]> {
       return await PostModel.find({ userId: user_id });
    }
    async findCountOfUserPosts(user_id: string): Promise<number> {
        return await PostModel.countDocuments({ userId: user_id });
    };

    async update(id: string, data: Partial<Post>): Promise<Post | null> {
        return await PostModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await PostModel.findByIdAndDelete(id);
        return result !== null;
    }

    async getAll(limit: number, page: number): Promise<(Post & { user: { username: string; name: string } })[]> {
      const skip = (page - 1) * limit;
  
      const posts = await PostModel.find()
          .populate({ path: "userId", select: "username name" })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
  
      return posts.map((post) => ({
          id: post.id,
          media: post.media,
          title: post.title,
          tags: post.tags,
          description: post.description,
          time: post.time,
          userId:"",
          user: {
              username: (post.userId as any)?.username,
              name: (post.userId as any)?.name
          }
      }));
  }
}
