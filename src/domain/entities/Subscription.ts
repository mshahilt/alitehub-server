export class Subscription {
    public readonly id!: string;
    public companyId!: string;
    public stripeCustomerId!: string;
    public stripeSubscriptionId!: string;
    public stripePriceId!: string;
    public status!: string; 
    public currentPeriodStart!: Date;
    public currentPeriodEnd!: Date;

    constructor(data: Partial<Subscription>) {
        Object.assign(this, data);
    }
}