import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../interface/IPostRepository";

export class PostUseCase {
    constructor(private postRepository: IPostRepository) {}

    async createPost(post: Post): Promise<Post> {
        try {
            return await this.postRepository.create(post);
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