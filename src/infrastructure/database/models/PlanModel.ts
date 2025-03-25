import mongoose, { Document, Schema } from "mongoose";

interface IPlan extends Document {
    name: string;
    stripeProductId: string;
    stripePriceId: string;
    price: number;
    interval: string;
    features?: string[];
}

const PlanSchema: Schema = new Schema({
    name: { type: String, required: true },
    stripeProductId: { type: String, required: true },
    stripePriceId: { type: String, required: true },
    price: { type: Number, required: true },
    interval: { type: String, required: true },
    features: { type: [String] }
});

export default mongoose.model<IPlan>("Plan", PlanSchema);
