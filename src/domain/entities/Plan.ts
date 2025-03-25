export class Plan {
    public readonly id!: string;
    public name!: string;
    public stripeProductId!: string;
    public stripePriceId!: string;
    public price!: number;
    public interval!: string;
    public features?: string[];

    constructor(data: Partial<Plan>) {
        Object.assign(this, data);
    }
}