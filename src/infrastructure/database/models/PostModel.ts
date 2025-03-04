import mongoose, { Document, Schema, Model } from "mongoose";

interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  media: string;
  title: string;
  description: string;
  time: Date;
  tags: string[];
}

const postSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  media: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: Date, default: Date.now },
  tags: { 
    type: [String], 
    validate: {
      validator: (tags: string[]) => tags.length <= 5,
      message: "Tags cannot exceed 5",
    },
  },
});

const PostModel: Model<IPost> = mongoose.model<IPost>("Post", postSchema);
export default PostModel;
