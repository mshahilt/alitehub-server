import { Call } from "../../domain/entities/Call";


export interface ICallRepository {
    scheduleInterview(interview: Call): Promise<Call>;
    getInterviewsByUserId(userId: string): Promise<Call[]>;
    getInterviewsByRoomId(roomId: string): Promise<Call | null>;
}