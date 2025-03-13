import { Request, Response } from "express";
import { CallUseCase } from "../../application/useCases/CallUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { ApplicationUseCase } from "../../application/useCases/ApplicationUseCase";


export class CallController {
    constructor(private callUseCase: CallUseCase, private applicationUseCase : ApplicationUseCase){}

    async scheduleInterview(req: AuthenticatedRequest, res: Response) {
        try {
            const companyId = req.userId as string;
            const { userId, date, applicationId } = req.body.interview;
            const interview = await this.callUseCase.scheduleInterview(userId, companyId, date);
            const applicationData = {
                interview: interview.id,
                status: "interview-scheduled"
            }

            const response = await this.applicationUseCase.updateApplication(applicationId, applicationData);
            res.status(200).json({...response, ...interview});
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "An error occurred while scheduling the interview." });
        }
    }

    async getInterviewById(req: AuthenticatedRequest, res: Response) {
        try {
            const {roomId} = req.params;
            const userId = req.userId;
    
            const interview = await this.callUseCase.getInterviewByRoomId(roomId);
           
    
            res.status(200).json(interview);
            
        } catch (error) {
            console.error("Error getting interview:", error);
            res.status(500).json({ error: "Failed to get interview details" });
        }
    }

}
