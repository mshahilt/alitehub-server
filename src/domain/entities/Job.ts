export class Job {
    public readonly id!: string;
    public jobTitle!: string;
    public company!: string;
    public company_profile?: string;
    public workplaceType!: 'remote' | 'onsite' | 'hybrid';
    public jobType!: 'full-time' | 'part-time' | 'contract' | 'internship';
    public jobLocation!: string;
    public description!: string;
    public yearsExperienceExpecting!: string;
    public responsibilities!: string[];
    public qualifications!: string[];
    public skills!: string[];
    public postedDate?: Date;

    constructor(data: Partial<Job>) {
        Object.assign(this, data);
    }
}
