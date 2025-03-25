import mongoose, { Schema, Document } from "mongoose";

export interface SubscriptionDocument extends Document {
    companyId: mongoose.Types.ObjectId;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    status: string; // active, canceled, incomplete,
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
}

const SubscriptionSchema = new Schema<SubscriptionDocument>({
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    stripePriceId: { type: String, required: true },
    status: { type: String, required: true, enum: ["active", "canceled", "incomplete", "trialing", "past_due"] },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
}, { timestamps: true });

export const SubscriptionModel = mongoose.model<SubscriptionDocument>("Subscription", SubscriptionSchema);
