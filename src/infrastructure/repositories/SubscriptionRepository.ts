import { ISubscriptionRepository } from "../../application/interface/ISubscriptionRepository";
import { Subscription } from "../../domain/entities/Subscription";
import { SubscriptionModel } from "../database/models/SubscriptionModel";
export class SubscriptionRepositoryImpl implements ISubscriptionRepository {
    async createSubscription(subscription: Subscription): Promise<Subscription> {
        const createdSubscription =  await SubscriptionModel.create(subscription);

        return new Subscription({
            id: createdSubscription.id.toString(),
            companyId: createdSubscription.companyId.toString(),
            stripeSubscriptionId: createdSubscription.stripeSubscriptionId,
            status: createdSubscription.status,
            currentPeriodStart: createdSubscription.currentPeriodStart,
            currentPeriodEnd: createdSubscription.currentPeriodEnd,
        });
    }

    async getSubscriptionByCompanyId(companyId: string): Promise<Subscription | null> {
        return await SubscriptionModel.findOne({ companyId });
    }

    async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | null> {
        return await SubscriptionModel.findOne({ stripeSubscriptionId });
    }

    async updateSubscriptionStatus(subscriptionId: string, status: string): Promise<Subscription | null> {
        return await SubscriptionModel.findByIdAndUpdate(subscriptionId, { status }, { new: true });
    }
}
