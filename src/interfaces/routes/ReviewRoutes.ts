import express, {Response, Request} from "express";
import { ReviewRepositoryImpl } from "../../infrastructure/repositories/ReviewRepository";
import { ReviewUseCase } from "../../application/useCases/ReviewUseCase";
import { ReviewController } from "../controllers/ReviewController";


const router = express.Router();
const reviewRepository = new ReviewRepositoryImpl();
const createdReviewUseCase = new ReviewUseCase(reviewRepository);
const reviewController = new ReviewController(createdReviewUseCase);



router.post("/", (req: Request, res: Response) => reviewController.postReview(req, res));
router.get("/company/:companyId", (req: Request, res: Response) => reviewController.getReviewByCompanyId(req, res));

export default router;