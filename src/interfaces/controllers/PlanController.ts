import express,{ Request, Response } from "express";
import { PlanUseCase } from "../../application/useCases/PlanUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";


export class PlanController {
    constructor(private planUseCase: PlanUseCase){}

    async createPlan(req: Request, res: Response) {
        try {
            console.log("req.body", req.body);
            const { name, price, interval, features } = req.body;
            const plan = await this.planUseCase.createPlan(name, price, interval, features);
            res.status(201).json(plan);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPlanById(req: Request, res: Response) {
        try {
            const { planId } = req.params;
            const plan = await this.planUseCase.getPlanById(planId);
            if (plan) {
                res.status(200).json(plan);
            } else {
                res.status(404).json({ message: "Plan not found" });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllPlans(req: Request, res: Response) {
        try {
            const plans = await this.planUseCase.getAllPlans();
            res.status(200).json(plans);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updatePlan(req: Request, res: Response) {
        try {
            const { planId } = req.params;
            const updates = req.body;
            const updatedPlan = await this.planUseCase.updatePlan(planId, updates);
            if (updatedPlan) {
                res.status(200).json(updatedPlan);
            } else {
                res.status(404).json({ message: "Plan not found" });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async deletePlan(req: Request, res: Response) {
        try {
            const { planId } = req.params;
            const success = await this.planUseCase.deletePlan(planId);
            if (success) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: "Plan not found" });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async subscribe(req: AuthenticatedRequest, res: Response) {
        try {
            const { paymentMethodId, stripePriceId } = req.body;
            const companyId = req.userId as string;

            if (!companyId || !paymentMethodId || !stripePriceId) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const subscribedPlan = await this.planUseCase.subscribeToPlan(companyId, paymentMethodId, stripePriceId);
            res.status(200).json(subscribedPlan);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

   
}