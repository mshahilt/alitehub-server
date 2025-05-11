import { Company } from "../../domain/entities/Company";
import { User } from "../../domain/entities/User";
import { Admin } from "../../domain/entities/Admin";
import bcrypt from "bcrypt";
import JwtService from "../../infrastructure/services/JwtService";
import { IAdminRepository } from "../interface/IAdminRepository";
import { UserResponse } from "./UserUseCase";

export interface AdminResponse {
    name: string;
    email: string;
}
  

export class AdminUseCase {
    constructor(private adminRepository: IAdminRepository) {}

    async adminLogin(email: string, password: string): Promise<{admin:AdminResponse; accessToken: string}> {
        const admin = await this.adminRepository.findAdminByEmail(email);
        console.log(admin);
        if(!admin) {
            throw new Error("Admin not found");
        }
        const isVerified = await bcrypt.compare(password, admin.password);
        console.log("DO ADMIN VERIFIED", isVerified);

        if(isVerified) {
            if(!admin.id) {
                throw new Error("Admin ID is null");
            }
            const role = "admin"
            const accessToken = JwtService.generateToken(admin.id, role);
            const adminResponse: AdminResponse = {name: admin.name, email: admin.email};
            return {admin: adminResponse, accessToken}
        } else {
             throw new Error("Invalid credentials");
        }
    }
    async fetchAllUsers(limit: string): Promise<(User & { postsShared: number })[]> {
        try {
            const fetchLimit = Number(limit);
            const users = await this.adminRepository.fetchAllUsers(fetchLimit);
            if (!users) {
                throw new Error("No users found");
            }
            const usersWithPostsShared = await Promise.all(users.map(async (user) => {
                const postCount = await this.adminRepository.countOfPostsByUserId(user.id);
                return { ...user, postsShared: postCount };
            }));
            return usersWithPostsShared;
        } catch(error: any) {
            console.error("Error in fetching all users for admin", error);
            throw new Error("Error in fetching all users for admin");
        }
    }
    async fetchAllCompanies(): Promise<Company[]> {
        try {
            const companies = await this.adminRepository.fetchAllCompanies();
            return companies
        } catch (error) {
            console.log("Error in fetching all companies for admin", error);
            throw new Error("Error in fetching all companies for admin")
        }
    }
    async blockOrUnnlockUser(userId: string): Promise<{user: UserResponse}> {
        try {
            const updatedUser = await this.adminRepository.blockOrUnblockUser(userId);
            if (!updatedUser) {
                throw new Error("User not found");
            }
            return {user: updatedUser}
        } catch (error) {
            console.log("Error in fetching all companies for admin", error);
            throw new Error("Error in block or unblock user from admin")
        }
    }
    async blockOrUnblockCompany(companyId: string): Promise<{company: Company}> {
        try {
            const updatedCompany = await this.adminRepository.blockOrUnblockCompany(companyId);
            if (!updatedCompany) {
                throw new Error("Company not found");
            }
            return {company: updatedCompany}
        } catch (error) {
            console.log("Error in blocking or unblocking company for admin", error);
            throw new Error("Error in blocking or unblocking company for admin")
        }
    }
}