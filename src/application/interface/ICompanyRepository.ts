import { Company } from "../../domain/entities/Company";
import { Job } from "../../domain/entities/Job";
import { Quiz } from "../../domain/entities/Quiz";

export interface ICompanyRepository {
    createCompany(company: Company): Promise<Company>;
    findCompanyByEmail(email: string): Promise<Company | null>;
    generateOtp(email: string): Promise<string>;
    verifyOtp(email: string, otp: string) : Promise<boolean>;
    findCompanyById(companyId: string): Promise<Company | null>;
    findCompanyByCompanyIdentifier(companyIdentifier: string): Promise<Company | null>
    createJobs(jobDetails:Job, companyId: string):  Promise<Job | null>;
    createQuiz(jobId: string, quizQuestions:Quiz):  Promise<Quiz | null>;
    findJobsOfCompanyById(companyId: string):  Promise<Job[] | null>;
    updateCompanyById(companyId: string, companyData: Company): Promise<Company | null>
    // updateCompany(companyId: string, company: Partial<Company>): Promise<Company | null>;
    // deleteCompany(companyId: string): Promise<boolean>;
    // getAllCompanies(): Promise<Company[]>;
}