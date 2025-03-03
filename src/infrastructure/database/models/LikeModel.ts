import mongoose, { Document, Schema, Model } from "mongoose";

interface ILike extends Document {
  user_id: mongoose.Types.ObjectId;
  target_id: mongoose.Types.ObjectId;
  target_type: "Post" | "Comment";
  time: Date;
}

const likeSchema = new Schema<ILike>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  target_id: { type: Schema.Types.ObjectId, required: true },
  target_type: { type: String, enum: ["Post", "Comment"], required: true },
  time: { type: Date, default: Date.now },
});

const LikeModel: Model<ILike> = mongoose.model<ILike>("Like", likeSchema);
export default LikeModel;
