export class Post {
    public readonly id!: string;
    public user_id!: string;
    public media!: string;
    public title!: string;
    public time!: Date;
    public tags!: string[];

    constructor(data: Partial<Post>) {
        Object.assign(this, data);
    }
}
