import ConnectionModel from "../database/models/ConnectionModel";
import { Connection } from "../../domain/entities/Connection";
import { IConnectionRepository } from "../../application/interface/IConnectionRepository";

export class ConnectionRepository implements IConnectionRepository{

    async create(connection: Partial<Connection>): Promise<Connection> {
        const createdConnection = await ConnectionModel.create(connection);
        return new Connection({id: createdConnection.id, userId1: createdConnection.userId1.toString(), userId2: createdConnection.userId2.toString(), status: createdConnection.status, requestedAt: createdConnection.requestedAt, respondedAt: createdConnection.respondedAt});
    }

    async findByUsersId(userId1: string, userId2: string): Promise<Connection | null> {
        const connection = await ConnectionModel.findOne({
            $or: [
              { userId1, userId2 },
              { userId1: userId2, userId2: userId1 },
            ],
        });
        return connection ? new Connection({id: connection.id, userId1: connection.userId1.toString(), userId2: connection.userId2.toString(), status: connection.status, requestedAt: connection.requestedAt, respondedAt: connection.respondedAt}) : null;
    }
    async updateStatus(id: string, status: "pending" | "accepted" | "declined", respondedAt?: Date): Promise<Connection | null> {
        const updatedConnection = await ConnectionModel.findByIdAndUpdate(id, {status, respondedAt: respondedAt ||new Date()}, {new: true});
        return updatedConnection ? new Connection({id: updatedConnection.id, userId1: updatedConnection.userId1.toString(), userId2: updatedConnection.userId2.toString(), status: updatedConnection.status, requestedAt: updatedConnection.requestedAt, respondedAt: updatedConnection.respondedAt}) : null;
    }
    findCountOfUserConnections(userId: string): Promise<number> {
        const connectionCount = ConnectionModel.countDocuments({$or: [{userId1: userId}, {userId2: userId}]})
        return connectionCount;
    }
    async findPendingRequests(userId: string): Promise<Connection[]> {
        const connections = await ConnectionModel.find({userId2: userId, status: "Pending"});
        return connections.map(connection => new Connection({id: connection.id, userId1: connection.userId1.toString(), userId2: connection.userId2.toString(), status: connection.status, requestedAt: connection.requestedAt, respondedAt: connection.respondedAt}));
    }
    async findUserConnections(userId: string): Promise<Connection[]> {
        const connections = await ConnectionModel.find({$or: [{userId1: userId}, {userId2: userId}]});
        return connections.map(connection => new Connection({id: connection.id, userId1: connection.userId1.toString(), userId2: connection.userId2.toString(), status: connection.status, requestedAt: connection.requestedAt, respondedAt: connection.respondedAt}));
    }
    async deleteConnection(id: string): Promise<boolean> {
        const deletedConnection = await ConnectionModel.findByIdAndDelete(id);
        return !!deletedConnection;
    }

}