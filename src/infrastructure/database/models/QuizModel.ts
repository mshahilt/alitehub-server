import mongoose, { Document, Schema, Model } from "mongoose";

interface IQuizQuestion extends Document {
    questions: {
        question: string;
        type: 'multiple' | 'text' | 'boolean';
        options?: string[];
        correctAnswer?: string;
    }[];
    jobId: mongoose.Types.ObjectId;
}

const quizSchema = new Schema<IQuizQuestion>(
    {
        questions: [
            {
                question: { type: String, required: true },
                type: { type: String, required: true, enum: ['multiple', 'text', 'boolean'] },
                options: { type: [String] },
                correctAnswer: { type: String },
            },
        ],
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    },
    { timestamps: true }
);

const QuizModel: Model<IQuizQuestion> = mongoose.model<IQuizQuestion>("QuizQuestion", quizSchema);

export default QuizModel;
