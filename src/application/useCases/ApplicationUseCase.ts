import { Application } from "../../domain/entities/Application";
import JwtService from "../../infrastructure/services/JwtService";
import { IApplicationRepository } from "../interface/IApplicationRepository";
import { ObjectId } from 'mongoose';

export class ApplicationUseCase {
    constructor(private applicationRepository: IApplicationRepository) {}

    async fetchApplicationOfCompany(token: string): Promise<Application[]> {
        try {
            const verifiedDetails = await JwtService.verifyToken(token);
            if (!verifiedDetails?.userId) {
                throw Object.assign(new Error("Invalid token"), { statusCode: 401 });
            }
    
            const applications = await this.applicationRepository.fetchApplicationsByCompanyId(verifiedDetails?.userId);
            return applications ?? [];
        } catch (error) {
            console.error("Error fetching applications for job:", error);
            throw error;
        }
    }

    async fetchApplicationOfUsers(userId: string, token: string): Promise<Application[]> {
        try {
            const verifiedDetails = await JwtService.verifyToken(token);
            if (!verifiedDetails?.userId) {
                throw Object.assign(new Error("Invalid token"), { statusCode: 401 });
            }
    
            const applications = await this.applicationRepository.fetchApplicationsByUserId(userId);
            return applications ?? [];
        } catch (error) {
            console.error("Error fetching applications for user:", error);
            throw error;
        }
    }
    
    async fetchApplicationById(applicationId: string, token: string): Promise<Application | null> {
        try {
            const verifiedDetails = await JwtService.verifyToken(token);
            if (!verifiedDetails?.userId) {
                throw Object.assign(new Error("Invalid token"), { statusCode: 401 });
            }
    
            const application = await this.applicationRepository.fetchApplicationById(applicationId);
            return application ?? null; 
        } catch (error) {
            console.error("Error fetching application by ID:", error);
            throw error;
        }
    }

    async createApplication(applicationDatas: Application): Promise<Application | null> {
        try {
            const applicationData = new Application(applicationDatas);
    
            const application = await this.applicationRepository.createApplication(applicationData);
            return application;
        } catch (error) {
            console.error("Error creating application:", error);
            throw new Error("Failed to create application");
        }
    }
    
    
    
    
    
}