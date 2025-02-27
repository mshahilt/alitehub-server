import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IApplications extends Document {
  _id: ObjectId;
  user_id: ObjectId;
  job_id: ObjectId;
  status: string;
  quiz_score: number;
  quiz_id: ObjectId;
}

const ApplicationsSchema: Schema = new Schema<IApplications>({
  user_id: { type: Schema.Types.ObjectId, required: true },
  job_id: { type: Schema.Types.ObjectId, required: true },
  status: { type: String, required: true },
  quiz_score: { type: Number, required: true },
  quiz_id: { type: Schema.Types.ObjectId, required: true },
});

const ApplicationModel = mongoose.model<IApplications>('Applications', ApplicationsSchema);

export default ApplicationModel;
