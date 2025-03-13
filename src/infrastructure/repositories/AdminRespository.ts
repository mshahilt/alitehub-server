import { User } from "../../domain/entities/User";
import { Company } from "../../domain/entities/Company";
import CompanyModel from "../database/models/CompanyModel";
import UserModel from "../database/models/UserModel";
import { IAdminRepository } from "../../application/interface/IAdminRepository";
import AdminModel from "../database/models/AdminModel";
import { Admin } from "../../domain/entities/Admin";
import { UserResponse } from "../../application/useCases/UserUseCase";

export class AdminRepositoryImpl implements IAdminRepository {
    async findAdminByEmail(email: string): Promise<Admin | null> {
        const admin = await AdminModel.findOne({email});
        if(!admin) {
            return null
        }
        return new Admin({id:admin.id ,email: admin.email, password: admin.password, name: admin.name});
    }
    async fetchAllCompanies(): Promise<Company[]> {
        const companies = await CompanyModel.find();
        return companies.map(company => new Company({id: company.id, name: company.name, email:company.email , companyIdentifier: company.companyIdentifier, industry: company.industry, profile_picture: company.profile_picture, locations: company.locations, companyType: company.companyType, contact: company.contact, isBlock: company.isBlock}));
    }

    async fetchCompanyById(companyId: string): Promise<Company | null> {
        const company = await CompanyModel.findById(companyId);
        return company ? new Company(company) : null;
    }

    async fetchAllUsers(): Promise<User[]> {
        const users = await UserModel.find();
        return users.map(user => new User({ id: user.id, name: user.name, username: user.username, email: user.email, isBlocked: user.isBlocked }));
    }

    async fetchUserById(userId: string): Promise<User | null> {
        const user = await UserModel.findById(userId);
        return user ? new User(user) : null;
    }


    async blockOrUnblockUser(userId: string): Promise<UserResponse | null> {
        const user = await UserModel.findById(userId);
        if (!user) return null;
    
        user.isBlocked = !user.isBlocked;
        await user.save();
    
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            isBlocked: user.isBlocked
        };
    }

    async blockOrUnblockCompany(companyId: string): Promise<Company | null> {
        const company = await CompanyModel.findById(companyId);
        if (!company) return null;

        company.isBlock = !company.isBlock;
        await company.save();

        return new Company({
            id: company.id,
            name: company.name,
            email: company.email,
            companyIdentifier: company.companyIdentifier,
            industry: company.industry,
            profile_picture: company.profile_picture,
            locations: company.locations,
            companyType: company.companyType,
            contact: company.contact,
            isBlock: company.isBlock
        });
    }
}