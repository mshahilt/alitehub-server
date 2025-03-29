import { User } from "../../domain/entities/User";
import { ICompanyRepository } from "../../application/interface/ICompanyRepository";
import CompanyModel from "../database/models/CompanyModel";
import OtpModel from "../database/models/OtpModel";
import JobModel from "../database/models/JobModel";
import { Otp } from "../../domain/entities/Otp";
import { EmailService } from "../services/EmailService";
import { Company } from "../../domain/entities/Company";
import { Job } from "../../domain/entities/Job";

export class CompanyRepositoryImpl implements ICompanyRepository {
    async generateOtp(email: string): Promise<string> {
        const generateOtp = Otp.generate(email);

        if(!generateOtp || !generateOtp.code || !generateOtp.expiresAt) {
            throw new Error("Failed to generate OTP");
        }

        try {
            await OtpModel.deleteMany({email});

            const generatedAndSavedOtp =  await OtpModel.create({
                code: generateOtp.code,
                email: generateOtp.email,
                expiresAt: generateOtp.expiresAt
            })

            await EmailService.sendOtp(email, generatedAndSavedOtp.code);

            return `OTP generated and sent to ${generatedAndSavedOtp.email}`; 
        }catch (error) {
            console.error("Error saving OTP:", error);
            throw new Error("Could not save OTP to the database");
        }
    }
    async findCompanyByEmail(email: string): Promise<Company | null> {
        const company = await CompanyModel.findOne({ email });
        if (!company) {
            return null;
        }
        return new Company({id:company.id, isBlock:company.isBlock,name:company.name, email:company.email, password:company.password});
    }
    async createCompany(company: Company): Promise<Company> {
        const createdCompany = await CompanyModel.create({
            name: company.name,
            email: company.email,
            industry: company.industry,
            companyIdentifier: company.companyIdentifier,
            companyType:company.companyType,
            password: company.password,
            profile_picture: company.profile_picture
        })

        return new Company({id: createdCompany.id, name: createdCompany.name, email: createdCompany.email, password: createdCompany.password});
    }
    async verifyOtp(email: string, otp: string): Promise<boolean> {
        try{
            const existingOtp = await OtpModel.findOne({email});

            if(!existingOtp) {
                return false;
            }

            if(new Date() > existingOtp.expiresAt) {
                await OtpModel.deleteOne({_id: existingOtp._id});
                return false;
            }

            await OtpModel.deleteOne({_id: existingOtp.id});
            return true
        }catch(error) {
            console.error("Error while verifying otp:", error);
            return false;
        }
    }
    async findCompanyById(companyId: string): Promise<Company | null> {
        try {
            const company = await CompanyModel.findById(companyId).select("-password");
            return company ? new Company({id: company.id, isBlock:company.isBlock, name: company.name, email: company.email, companyIdentifier: company.companyIdentifier, industry: company.industry, companyType: company.companyType, contact: company.contact, profile_picture: company.profile_picture, locations: company.locations}) : null;
        } catch (error) {
            console.error("Error finding company by ID:", error);
            return null;
        }
    }
    async findCompanyByCompanyIdentifier(companyIdentifier: string): Promise<Company | null> {
        try {
            const company = await CompanyModel.findOne({companyIdentifier});
            return company ? new Company({ id: company.id, isBlock:company.isBlock, name: company.name, companyIdentifier: company.companyIdentifier, email: company.email,
                companyType: company.companyType, industry: company.industry, profile_picture: company.profile_picture 
             }) : null;
        } catch (error) {
            console.error("Error finding company by ID:", error);
            return null;
        }
    }
    async findJobsOfCompanyById(companyId: string): Promise<Job[] | null> {
        try {
            const jobs = await JobModel.find({companyId});
            return jobs ? jobs.map(job => new Job({ id: job.id,jobTitle:job.jobTitle, company: job.companyName, workplaceType: job.workplaceType, postedDate: job.postedDate })) : null
        } catch (error) {
            console.error('Error fetching job:', error);
            return null;
        }
    }
    async updateCompanyById(companyId: string, companyData: Partial<Company>): Promise<Company | null> {
        try {
            let company = await CompanyModel.findById(companyId);
            if (!company) {
                throw new Error("Company not found");
            }
    
            const dataKeysToBeUpdated = Object.keys(companyData);
    
            for (let key of dataKeysToBeUpdated) {
                (company as any)[key] = companyData[key as keyof Company];
            }
    
            await company.save(); 
            return new Company({name: company.name, email: company.email, companyIdentifier: company.companyIdentifier, industry: company.industry, companyType: company.companyType, contact: company.contact, profile_picture: company.profile_picture, locations: company.locations, isBlock: company.isBlock});
        } catch (error) {
            console.error("Error updating company:", error);
            throw error;
        }
    }
    
    async getAllCompanies(): Promise<Company[]> {
        try {
            const companies = await CompanyModel.find().select("-password");
            return companies.map(company => new Company({
                id: company.id,
                name: company.name,
                email: company.email,
                companyIdentifier: company.companyIdentifier,
                industry: company.industry,
                companyType: company.companyType,
                contact: company.contact,
                profile_picture: company.profile_picture,
                locations: company.locations,
                isBlock: company.isBlock
            }));
        } catch (error) {
            console.error("Error fetching all companies:", error);
            throw new Error("Could not fetch companies");
        }
    }
    
    
}