import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../interface/IPostRepository";

export class PostUseCase {
    constructor(private postRepository: IPostRepository) {}

    async createPost(post: Post, user_id: string): Promise<Post> {
        try {
            const newPost = new Post({
                userId: user_id,
                title: post.title,
                media: post.media,
                description: post.description,
                tags: post.tags,
                time: new Date()
            });
            console.log("newPost", newPost);
            return await this.postRepository.create(newPost);
        } catch (error: any) {
            throw new Error(`Failed to create post: ${error.message}`);
        }
    }

    async getPostById(id: string): Promise<Post | null> {
        try {
            return await this.postRepository.findById(id);
        } catch (error: any) {
            throw new Error(`Failed to get post by id: ${error.message}`);
        }
    }

    async getPostsByUserId(user_id: string): Promise<Post[]> {
        try {
            return await this.postRepository.findByUserId(user_id);
        } catch (error: any) {
            throw new Error(`Failed to get posts by user id: ${error.message}`);
        }
    }

    async updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
        try {
            return await this.postRepository.update(id, data);
        } catch (error: any) {
            throw new Error(`Failed to update post: ${error.message}`);
        }
    }

    async deletePost(id: string): Promise<boolean> {
        try {
            return await this.postRepository.delete(id);
        } catch (error: any) {
            throw new Error(`Failed to delete post: ${error.message}`);
        }
    }

    async getAllPosts(limit: number, offset: number): Promise<Post[]> {
        try {
            return await this.postRepository.getAll(limit, offset);
        } catch (error: any) {
            throw new Error(`Failed to get all posts: ${error.message}`);
        }
    }
}