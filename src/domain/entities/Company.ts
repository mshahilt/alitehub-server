export class Company {
    public readonly id!: string;
    public name!: string;
    public email!: string;
    public companyIdentifier!: string;
    public industry!: string;
    public companyType!: string;
    public password?: string;
    public contact?: { phone?: string | null };
    public profile_picture?: string | null;
    public locations?: string[] | null;
    constructor(data: Partial<Company>) {
        Object.assign(this, data)
    }
}