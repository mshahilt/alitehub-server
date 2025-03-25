import mongoose, { Document, Schema, Model } from "mongoose";

interface IComment extends Document {
  post_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  content: string;
  time: Date;
  replies: IComment[];
}

const commentSchema = new Schema<IComment>({
  post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  time: { type: Date, default: Date.now },
  replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const CommentModel: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);
export default CommentModel;
