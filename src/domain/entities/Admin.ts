export class Admin {
    public readonly id!: string
    public name!: string;
    public email!: string;
    public password!: string;

    constructor(data: Partial<Admin>) {
        Object.assign(this, data);
    }
}