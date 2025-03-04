import { ISearchRepository } from "../interface/ISearchRepository";
import { SearchResults, RecentSearch } from "../interface/ISearchRepository";

export class SearchUseCase {
    constructor(private searchRepository: ISearchRepository) {}

    async search(query: string, filter: string): Promise<SearchResults> {
        return this.searchRepository.search(query, filter);
    }
    async getRecentSearches(userId: string): Promise<RecentSearch[]> {
        return this.searchRepository.getRecentSearches(userId);
    }
    async saveRecentSearch(userId: string, query: string, filter: string): Promise<void> {
        return this.searchRepository.saveRecentSearch(userId, query, filter);
    }
    async deleteAllRecentSearches(userId: string): Promise<void> {
        return this.searchRepository.deleteAllRecentSearches(userId);
    }
    async getExplorePosts(): Promise<any[]> {
        return this.searchRepository.getExplorePosts();
    }
}