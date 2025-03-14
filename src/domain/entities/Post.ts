export class Post {
    public readonly id!: string;
    public userId!: string;
    public media!: string;
    public title!: string;
    public description!: string;
    public time!: Date;
    public tags!: string[];

    constructor(data: Partial<Post>) {
        Object.assign(this, data);
    }
}
