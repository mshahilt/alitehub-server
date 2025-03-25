import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PlanController } from "../controllers/PlanController";
import { PlanRepositoryImpl } from "../../infrastructure/repositories/PlanRepository";
import { PlanUseCase } from "../../application/useCases/PlanUseCase";
import Stripe from "stripe";
import { CompanyRepositoryImpl } from "../../infrastructure/repositories/CompanyRepository";
import { SubscriptionRepositoryImpl } from "../../infrastructure/repositories/SubscriptionRepository";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const planRepository = new PlanRepositoryImpl();
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables");
}
const companyRepositroy = new CompanyRepositoryImpl();
const subscriptionRepository = new SubscriptionRepositoryImpl();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const createdPlanUseCase = new PlanUseCase(planRepository, stripe, companyRepositroy, subscriptionRepository);
const planController = new PlanController(createdPlanUseCase);

router.post("/", (req, res) => planController.createPlan(req, res));
router.post('/subscribe', AuthMiddleware("company"), async (req, res) => {
    await planController.subscribe(req, res);
})
router.get("/:planId", (req, res) => planController.getPlanById(req, res));
router.get("/", (req, res) => planController.getAllPlans(req, res));
router.put("/:planId", (req, res) => planController.updatePlan(req, res));
router.delete("/:planId", (req, res) => planController.deletePlan(req, res));



export default router;