import { Plan } from "../../domain/entities/Plan";

export interface IPlanRepository {
    createPlan(name: string, stripeProductId: string, stripePriceId: string, price: number, interval: string, features?: string[]): Promise<Plan>;
    getPlanById(planId: string): Promise<Plan | null>;
    getAllPlans(): Promise<Plan[]>;
    updatePlan(planId: string, updates: Partial<Plan>): Promise<Plan | null>;
    deletePlan(planId: string): Promise<boolean>;
}
