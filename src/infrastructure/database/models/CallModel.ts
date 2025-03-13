import mongoose, { Document, Schema } from "mongoose";

interface ICall extends Document {
  callType: "interview" | "normal";
  caller: mongoose.Types.ObjectId;
  callerType: "User" | "Company";
  receiver: mongoose.Types.ObjectId;
  receiverType: "User" | "Company";
  roomId: string;
  status: "scheduled" | "ongoing" | "ended";
  scheduledTime?: Date;
  endedAt?: Date;
}

const callSchema: Schema = new Schema(
  {
    callType: { type: String, required: true, enum: ["interview", "normal"] },
    caller: { type: Schema.Types.ObjectId, required: true, refPath: "callerType" },
    callerType: { type: String, enum: ["User", "Company"], required: true },

    receiver: { type: Schema.Types.ObjectId, required: true, refPath: "receiverType" },
    receiverType: { type: String, enum: ["User", "Company"], required: true },

    roomId: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "ongoing", "ended"], default: "scheduled" },
    scheduledTime: { type: Date },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ICall>("Call", callSchema);
