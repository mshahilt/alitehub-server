import { Company } from "../../domain/entities/Company";
import { ICompanyRepository } from "../interface/ICompanyRepository";
import bcrypt from "bcrypt";
import JwtService from "../../infrastructure/services/JwtService";
import { GoogleAuthService } from "../../infrastructure/services/googleAuthService";

interface CompanyDTO {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
    otp: string;
}
interface CompanyResponse {
    name: string;
    email: string;
}
export class CompanyUseCase {
    constructor(private companyRepository:ICompanyRepository) {}
    async generateOtp(email: string): Promise<string> {
        await this.companyRepository.generateOtp(email);
        return `otp generated for ${email}`;
    }
    async companyLogin(email: string, password: string): Promise<{ company: CompanyResponse; token: string; message:string }>{
        const company = await this.companyRepository.findCompanyByEmail(email);
        if (!company) {
            throw new Error("User not found");
        }
        if (!company.password) {
            throw new Error("User password is undefined");
        }
          const isVerified = await bcrypt.compare(password, company.password);
          if(isVerified){
                const token = JwtService.generateToken(company.id);
                const companyResponse:CompanyResponse = {name: company.name, email: company.email} 
                return {company:companyResponse, token, message: `${company.name}'s account verified`};
        } else {
            throw new Error("Invalid credentials");
        }
    }
    async register(newCompany: CompanyDTO): Promise<{company: CompanyResponse, token: string}> {
        
        if (newCompany.password !== newCompany.confirmPassword) {
            throw new Error("Passwords do not match");
        }
        if (!newCompany.termsAccepted) {
            throw new Error("Terms must be accepted");
        }
        const existingCompany = await this.companyRepository.findCompanyByEmail(newCompany.email);
        if(existingCompany) {
            throw new Error("User already exists");
        }
        const isOtpValid = await this.companyRepository.verifyOtp(newCompany.email, newCompany.otp);
        if(!isOtpValid) {
            throw new Error("OTP verification failed");
        }
        const hashedPassword = await bcrypt.hash(newCompany.password, 10);

        const company = new Company({
            id: Date.now().toString(),
            name: newCompany.name,
            email: newCompany.email,
            password: hashedPassword
        })
        
        const createdCompany = await this.companyRepository.createCompany(company);
        if(!createdCompany.id) {
            throw new Error("Failed to create user");
        }

        const token = JwtService.generateToken(createdCompany.id);
        const response: CompanyResponse = {name: createdCompany.name, email: createdCompany.email};

        return {company: response, token};
    }
    async googleAuthenticate(token: string) {
        const googleUser = await GoogleAuthService.verifyGoogleToken(token);

        let company = await this.companyRepository.findCompanyByEmail(googleUser.email);
        if(!company) {
            throw new Error("Company with credential not exist");
        }

        const jwtToken = JwtService.generateToken(company.id);
        const companyResponse: CompanyResponse = {name: company.name, email: company.email};
        
        return {company: companyResponse, token: jwtToken};
    }
}