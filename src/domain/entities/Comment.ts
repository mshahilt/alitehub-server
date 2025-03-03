export class Comment {
    public readonly id!: string;
    public user_id!: string;
    public post_id!: string;
    public content!: string;
    public time!: Date;
    public replies!: Comment[];

    constructor(data: Partial<Comment>) {
        Object.assign(this, data);
    }
}
