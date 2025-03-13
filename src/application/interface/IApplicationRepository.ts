import { Application } from "../../domain/entities/Application"

export interface IApplicationRepository{
    fetchAllApplications(): Promise<Application[] | null>;
    fetchApplicationsByCompanyId(jobId: string): Promise<Application[] | null>;
    fetchApplicationsByUserId(userId: string): Promise<Application[] | null>;
    fetchApplicationById(applicationId: string): Promise<Application | null>;
    createApplication(applicationData: Application): Promise<Application | null>;
    updateApplication(applicationId: string, updateData: Partial<Application> ): Promise<Application | null>;
}