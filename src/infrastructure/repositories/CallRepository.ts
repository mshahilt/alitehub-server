import CallModel from "../database/models/CallModel";
import { Call } from "../../domain/entities/Call";
import { ICallRepository } from "../../application/interface/ICallRepository";


export class CallRepositoryImpl implements ICallRepository {

    async scheduleInterview(interview: Call): Promise<Call> {
        const call = await CallModel.create(interview);
        return new Call({
            id: call.id,
            caller: call.caller.toString(),
            callerType: call.callerType,
            roomId: call.roomId,
            receiver: call.receiver.toString(),
            receiverType: call.receiverType,
            scheduledTime: call.scheduledTime,
            status: call.status,
            endedAt: call.endedAt
        });
}

    async getInterviewsByUserId(userId: string): Promise<Call[]> {
        const calls = await CallModel.find({ 
            $or: [{ caller: userId }, { receiver: userId }] 
        });
        return calls.map(call => new Call({
            caller: call.caller.toString(),
            callerType: call.callerType,
            roomId: call.roomId,
            receiver: call.receiver.toString(),
            receiverType: call.receiverType,
            scheduledTime: call.scheduledTime,
            status: call.status,
            endedAt: call.endedAt
        }));
    }
    async getInterviewsByRoomId(roomId: string): Promise<Call | null> {
        const call = await CallModel.findOne({ roomId: roomId });
        if (!call) {
            return null;
        }
        return new Call({
            id: call.id,
            caller: call.caller.toString(),
            callerType: call.callerType,
            roomId: call.roomId,
            receiver: call.receiver.toString(),
            receiverType: call.receiverType,
            scheduledTime: call.scheduledTime,
            status: call.status,
            endedAt: call.endedAt
        });
    }
}