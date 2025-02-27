import { Request, Response } from "express";
import { ApplicationUseCase } from "../../application/useCases/ApplicationUseCase";
import JwtService from "../../infrastructure/services/JwtService";
import { Types } from "mongoose";

export class ApplicationController {
    constructor(private applicationUseCase: ApplicationUseCase) {}


    async fetchApplicationById(req: Request, res: Response): Promise<Response> {
        try {
            const { applicationId } = req.params;
            const token = req.headers.authorization;
            
            if (!token) {
                return res.status(401).json({ message: "Authorization token missing" });
            }

            const application = await this.applicationUseCase.fetchApplicationById(applicationId, token);
            
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            return res.status(200).json(application);
        } catch (error) {
            console.error("Error fetching application:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async fetchApplicationsOfUser(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return res.status(401).json({ message: "Authorization token missing" });
            }

            const verifiedDetails = await JwtService.verifyToken(token);
            if (!verifiedDetails?.userId) {
                return res.status(401).json({ message: "Invalid token" });
            }

            const applications = await this.applicationUseCase.fetchApplicationOfUsers(verifiedDetails.userId, token);

            return res.status(200).json({ applications });
        } catch (error) {
            console.error("Error fetching user's applications:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async fetchApplicationsOfJob(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return res.status(401).json({ message: "Authorization token missing" });
            }

            const applications = await this.applicationUseCase.fetchApplicationOfCompany(token);

            return res.status(200).json({ applications });
        } catch (error) {
            console.error("Error fetching applications for job:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
