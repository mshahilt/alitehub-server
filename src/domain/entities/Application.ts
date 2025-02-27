import { ObjectId } from 'mongoose';

export class Application {
    public readonly id!: ObjectId;
    public user_id!: ObjectId;
    public job_id!: ObjectId;
    public status!: string;
    public quiz_score!: number;
    public quiz_id!: ObjectId;

    constructor(data: Partial<Application>) {
        Object.assign(this, data);
    }
}
