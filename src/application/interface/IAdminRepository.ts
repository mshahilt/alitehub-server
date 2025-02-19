import { Company } from "../../domain/entities/Company";
import { User } from "../../domain/entities/User";
import { Admin } from "../../domain/entities/Admin";
import { UserResponse } from "../useCases/UserUseCase";

export interface IAdminRepository {
    fetchAllCompanies(): Promise<Company[]>;
    fetchCompanyById(companyId: string): Promise<Company | null>;
    blockOrUnblockCompany(companyId: string, company: Partial<Company>): Promise<Company | null>;
    findAdminByEmail(email: string): Promise<Admin | null>;
    fetchAllUsers(): Promise<User[] | null>;
    fetchUserById(userId: string): Promise<User | null>;
    blockOrUnblockUser(userId: string): Promise<UserResponse | null>;
   
}