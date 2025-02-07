import { Company } from "../../domain/entities/Company";

export interface ICompanyRepository {
    createCompany(company: Company): Promise<Company>;
    findCompanyByEmail(email: string): Promise<Company | null>;
    generateOtp(email: string): Promise<string>;
    verifyOtp(email: string, otp: string) : Promise<boolean>;
    // getCompanyById(companyId: string): Promise<Company | null>;
    // updateCompany(companyId: string, company: Partial<Company>): Promise<Company | null>;
    // deleteCompany(companyId: string): Promise<boolean>;
    // getAllCompanies(): Promise<Company[]>;
}