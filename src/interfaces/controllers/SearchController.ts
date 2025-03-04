import { Request, Response } from "express";
import { SearchUseCase } from "../../application/useCases/SearchUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";


export class SearchController {
    constructor(private searchUseCase: SearchUseCase) {}

    async search(req: Request, res: Response): Promise<void> {
        try {
          const { q: query, filter } = req.query;
          const results = await this.searchUseCase.search(
            query as string,
            filter as string || 'all'
          );
          res.json({ results });
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      }
    
      async getRecentSearches(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
          const userId = req.userId;          if (!userId) throw new Error('User not authenticated');
          const searches = await this.searchUseCase.getRecentSearches(userId);
          res.json(searches);
        } catch (error) {
          res.status(401).json({ error: 'Unauthorized' });
        }
      }
    
      async saveRecentSearch(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
          const userId = req.userId;
          const { query, filter } = req.body;
          if (!userId) throw new Error('User not authenticated');
          await this.searchUseCase.saveRecentSearch(userId, query, filter);
          res.status(201).send();
        } catch (error) {
          res.status(401).json({ error: 'Unauthorized' });
        }
      }

    
      async deleteAllRecentSearches(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
          const userId = req.userId;
          if (!userId) throw new Error('User not authenticated');
          await this.searchUseCase.deleteAllRecentSearches(userId);
          res.status(204).send();
        } catch (error) {
          res.status(401).json({ error: 'Unauthorized' });
        }
      }
    
      async getExplorePosts(req: Request, res: Response): Promise<void> {
        try {
          const posts = await this.searchUseCase.getExplorePosts();
          res.json(posts);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      }
}