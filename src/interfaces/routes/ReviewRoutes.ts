import express, { Response, Request } from "express";
import { ReviewRepositoryImpl } from "../../infrastructure/repositories/ReviewRepository";
import { ReviewUseCase } from "../../application/useCases/ReviewUseCase";
import { ReviewController } from "../controllers/ReviewController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const reviewRepository = new ReviewRepositoryImpl();
const createdReviewUseCase = new ReviewUseCase(reviewRepository);
const reviewController = new ReviewController(createdReviewUseCase);

router.post("/", AuthMiddleware("user"), (req: Request, res: Response) => reviewController.postReview(req, res));
router.get("/company/:companyId", AuthMiddleware("both"), (req: Request, res: Response) => reviewController.getReviewByCompanyId(req, res));

export default router;
