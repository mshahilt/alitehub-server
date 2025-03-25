import { Subscription } from "../../domain/entities/Subscription";


export interface ISubscriptionRepository {
    createSubscription(subscription: Subscription): Promise<Subscription>;
    getSubscriptionByCompanyId(companyId: string): Promise<Subscription | null>;
    getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | null>;
    updateSubscriptionStatus(subscriptionId: string, status: string): Promise<Subscription | null>;
}