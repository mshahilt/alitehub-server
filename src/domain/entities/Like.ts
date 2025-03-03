export class Like {
    public readonly id!: string;
    public user_id!: string;
    public target_id!: string; 
    public target_type!: "Post" | "Comment";
    public time!: Date;

    constructor(data: Partial<Like>) {
        Object.assign(this, data);
    }
}
