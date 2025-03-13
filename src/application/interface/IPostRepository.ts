import { Post } from "../../domain/entities/Post";

export interface IPostRepository {
    create(post: Post): Promise<Post>;
    findById(id: string): Promise<Post | null>;
    findByUserId(user_id: string): Promise<Post[]>;
    findCountOfUserPosts(user_id: string): Promise<number>;
    update(id: string, data: Partial<Post>): Promise<Post | null>;
    delete(id: string): Promise<boolean>;
    getAll(limit: number, page: number): Promise<Post[]>;
}
