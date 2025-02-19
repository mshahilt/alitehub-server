import { Types } from "mongoose";

export class Quiz {
    public readonly id!: string;
    public questions!: {
        question: string;
        type: "multiple" | "text" | "boolean";
        options?: string[];
        correctAnswer?: string;
    }[];
    public jobId?: Types.ObjectId;

    constructor(data: Partial<Quiz>) {
        Object.assign(this, data);
    }
}
