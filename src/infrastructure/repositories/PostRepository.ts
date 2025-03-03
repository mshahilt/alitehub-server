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
        return await PostModel.find({ user_id });
    }

    async update(id: string, data: Partial<Post>): Promise<Post | null> {
        return await PostModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await PostModel.findByIdAndDelete(id);
        return result !== null;
    }

    async getAll(limit: number, offset: number): Promise<Post[]> {
        const posts =  await PostModel.find().skip(offset).limit(limit);
        return posts.map((post) => new Post({id: post.id, media: post.media, title: post.title, tags: post.tags, time: post.time}));
    }
}
