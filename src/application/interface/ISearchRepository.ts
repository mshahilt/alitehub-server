import { User } from "../../domain/entities/User";
import { Post } from "../../domain/entities/Post";
import { Job } from "../../domain/entities/Job";
import { Company } from "../../domain/entities/Company";

export interface SearchResults {
    users: User[];
    posts: Post[];
    jobs: Job[];
}
export type RecentSearch = (User | Post | Job | Company)[];

export interface ISearchRepository {
    search(query: string, filter: string): Promise<SearchResults>;
    getRecentSearches(userId: string): Promise<RecentSearch[]>;
    saveRecentSearch(userId: string, query: string, filter: string): Promise<void>;
    deleteAllRecentSearches(userId: string): Promise<void>;
    getExplorePosts(): Promise<any[]>;
}