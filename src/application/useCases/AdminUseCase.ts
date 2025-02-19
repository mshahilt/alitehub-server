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
        console.log("admin credentials",email, password);
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
            console.log("Admin verified response: ", adminResponse);
            return {admin: adminResponse, accessToken}
        } else {
             throw new Error("Invalid credentials");
        }
    }
    async fetchAllUsers(): Promise<User[]> {
        try {
            const users = await this.adminRepository.fetchAllUsers();
            if (!users) {
                throw new Error("No users found");
            }
            return users;
        } catch(error: any) {
            console.error("Error in fetching all users for admin",error);
            throw new Error("Error in fetching all users for admin")
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
}