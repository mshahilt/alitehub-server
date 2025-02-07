import { User } from "../../domain/entities/User";
import { ICompanyRepository } from "../../application/interface/ICompanyRepository";
import CompanyModel from "../database/models/CompanyModel";
import OtpModel from "../database/models/OtpModel";
import { Otp } from "../../domain/entities/Otp";
import { EmailService } from "../services/EmailService";
import { Company } from "../../domain/entities/Company";

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
        return new Company({id:company.id, name:company.name, email:company.email, password:company.password});
    }
    async createCompany(company: Company): Promise<Company> {
        const createdCompany = await CompanyModel.create({
            name: company.name,
            email: company.email,
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
}