import { IPlanRepository } from "../../application/interface/IPlanRepository";
import PlanModel from "../database/models/PlanModel";
import { Plan } from "../../domain/entities/Plan";


export class PlanRepositoryImpl implements IPlanRepository {
    async createPlan(name: string, stripeProductId: string, stripePriceId: string, price: number, interval: string, features?: string[]): Promise<Plan> {
        const plan = new PlanModel({ name, stripeProductId, stripePriceId, price, interval, features });
        const createdPlan = await plan.save();
        return new Plan({
            id: createdPlan.id,
            name: createdPlan.name,
            stripeProductId: createdPlan.stripeProductId,
            stripePriceId: createdPlan.stripePriceId,
            price: createdPlan.price,
            interval: createdPlan.interval,
            features: createdPlan.features
        });
    }

    async getPlanById(planId: string): Promise<Plan | null> {
        return await PlanModel.findById(planId);
    }

    async getAllPlans(): Promise<Plan[]> {
        return await PlanModel.find();
    }

    async updatePlan(planId: string, updates: Partial<Plan>): Promise<Plan | null> {
        return await PlanModel.findByIdAndUpdate(planId, updates, { new: true });
    }

    async deletePlan(planId: string): Promise<boolean> {
        const result = await PlanModel.findByIdAndDelete(planId);
        return result !== null;
    }
}
