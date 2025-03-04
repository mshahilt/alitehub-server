import express from 'express';
import { SearchRepositoryImpl } from '../../infrastructure/repositories/SearchRepository';
import { SearchUseCase } from '../../application/useCases/SearchUseCase';
import { SearchController } from '../controllers/SearchController';
import { AuthMiddleware } from "../middlewares/authMiddleware"; 

const router = express.Router();
const searchRepository = new SearchRepositoryImpl();
const createdSearchUseCase = new SearchUseCase(searchRepository);
const searchController = new SearchController(createdSearchUseCase);

router
    .get('/',AuthMiddleware("user"), async (req, res) => {
    await searchController.search(req, res);
    })
    .get('/recent',AuthMiddleware("user"), async (req, res) => {
    await searchController.getRecentSearches(req, res);
    })
    .post('/recent',AuthMiddleware("user"), async (req, res) => {
    await searchController.saveRecentSearch(req, res);
    })
    .delete('/recent',AuthMiddleware("user"), async (req, res) => {
    await searchController.deleteAllRecentSearches(req, res);
    })
    .get('/explore',AuthMiddleware("user"), async (req, res) => {
    await searchController.getExplorePosts(req, res);
    });


export default router;
