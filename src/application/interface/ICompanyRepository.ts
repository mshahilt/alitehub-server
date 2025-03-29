import { Company } from "../../domain/entities/Company";
import { Job } from "../../domain/entities/Job";

export interface ICompanyRepository {
    createCompany(company: Company): Promise<Company>;
    findCompanyByEmail(email: string): Promise<Company | null>;
    generateOtp(email: string): Promise<string>;
    verifyOtp(email: string, otp: string) : Promise<boolean>;
    findCompanyById(companyId: string): Promise<Company | null>;
    findCompanyByCompanyIdentifier(companyIdentifier: string): Promise<Company | null>
    findJobsOfCompanyById(companyId: string):  Promise<Job[] | null>;
    updateCompanyById(companyId: string,  companyData: Partial<Company>): Promise<Company | null>
    getAllCompanies(): Promise<Company[]>;
    // updateCompany(companyId: string, company: Partial<Company>): Promise<Company | null>;
    // deleteCompany(companyId: string): Promise<boolean>;
}