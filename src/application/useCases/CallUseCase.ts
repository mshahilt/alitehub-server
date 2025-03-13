import { Call } from "../../domain/entities/Call";
import generateRandomString from "../../infrastructure/utility/generateRandomId";
import { ICallRepository } from "../interface/ICallRepository";


export class CallUseCase {
    constructor(private callRepository: ICallRepository) {}

    async scheduleInterview(companyId: string, userId: string, date: Date): Promise<Call> {
        const interview = new Call ({
            callType: "interview",
            callerType: "Company",
            caller: companyId,
            receiverType: "User",
            receiver: userId,
            roomId: generateRandomString(),
            scheduledTime: date,
            status: "scheduled",
        })
        return await this.callRepository.scheduleInterview(interview);
    }
    async findInterviewsByUserId(userId: string): Promise<Call[]> {
        return this.callRepository.getInterviewsByUserId(userId);
    }
    async getInterviewByRoomId(roomId: string): Promise<Call | null> {
        return await this.callRepository.getInterviewsByRoomId(roomId);
    }
}