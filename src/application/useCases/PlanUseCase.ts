import { error } from "console";
import { Plan } from "../../domain/entities/Plan";
import { ICompanyRepository } from "../interface/ICompanyRepository";
import { IPlanRepository } from "../interface/IPlanRepository";
import stripe from "stripe";
import { ISubscriptionRepository } from "../interface/ISubscriptionRepository";
import { Subscription } from "../../domain/entities/Subscription";

export class PlanUseCase {
    constructor(private planRepository: IPlanRepository, private stripe: stripe, private companyRepository: ICompanyRepository, private subscriptionRepository: ISubscriptionRepository ) {}
    async createPlan(name: string, price: number, interval: stripe.Price.Recurring.Interval, features?: string[]): Promise<Plan> {
        const product = await this.stripe.products.create({ name });
        const priceData = await this.stripe.prices.create({
            unit_amount: price * 100,
            currency: "inr",
            recurring: { interval },
            product: product.id,
        });

        return await this.planRepository.createPlan(name, product.id, priceData.id, price, interval, features);
    }

    async getPlanById(planId: string): Promise<Plan | null> {
        return await this.planRepository.getPlanById(planId);
    }

    async getAllPlans(): Promise<Plan[]> {
        return await this.planRepository.getAllPlans();
    }

    async updatePlan(planId: string, updates: Partial<Plan>): Promise<Plan | null> {
        return await this.planRepository.updatePlan(planId, updates);
    }

    async deletePlan(planId: string): Promise<boolean> {
        return await this.planRepository.deletePlan(planId);
    }

    async subscribeToPlan(companyId: string, paymentMethodId: string, stripePriceId: string) {
        let subscription = await this.subscriptionRepository.getSubscriptionByCompanyId(companyId);
        let stripeCustomerId = subscription ? subscription.stripeCustomerId : null;

        if (!stripeCustomerId) {
            const customer = await this.stripe.customers.create({
                payment_method: paymentMethodId,
                invoice_settings: { default_payment_method: paymentMethodId },
            });

            stripeCustomerId = customer.id;
        }

        const stripeSubscription = await this.stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [{ price: stripePriceId }],
            expand: ["latest_invoice.payment_intent"],
        });

        const newSubscription = new Subscription({
            companyId,
            stripeCustomerId,
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId,
            status: stripeSubscription.status,
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        });

        const createdSubscription = await this.subscriptionRepository.createSubscription(newSubscription);

        return createdSubscription;
    }
    async getSubscribedPlan(companyId: string) {
        try {
            return await this.subscriptionRepository.getSubscriptionByCompanyId(companyId);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
}