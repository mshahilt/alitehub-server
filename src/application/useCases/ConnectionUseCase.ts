import { Connection } from "../../domain/entities/Connection";
import { IConnectionRepository } from "../interface/IConnectionRepository";

export class ConnectionUseCase {
    constructor(private connectionRepository: IConnectionRepository) {}

    async createConnection(userId1: string, userId2: string): Promise<Connection> {
        const connection = await this.connectionRepository.findByUsersId(userId1, userId2);
        if (connection) {
            throw new Error("Connection already exists");
        }
        console.log("userId1", userId1);
        console.log("userId2", userId2);

        const result =  await this.connectionRepository.create({userId1, userId2, status: "pending", requestedAt: new Date()});
        console.log("result", result);
        return result
    }

    async findUsersConnection(userId1: string, userId2: string): Promise<Connection | null> {
        const connection = this.connectionRepository.findByUsersId(userId1, userId2);
        return connection;
    }

    async acceptConnection(connectionId: string): Promise<Connection> {
        const connection = await this.connectionRepository.updateStatus(connectionId, "Accepted", new Date());
        if (!connection) {
            throw new Error("Connection not found");
        }
        return connection;
    }

    async declineConnection(connectionId: string): Promise<Connection> {
        const connection = await this.connectionRepository.updateStatus(connectionId, "Declined", new Date());
        if (!connection) {
            throw new Error("Connection not found");
        }
        return connection;
    }

    async findPendingRequests(userId: string): Promise<Connection[]> {
        return this.connectionRepository.findPendingRequests(userId);
    }

    async findUserConnections(userId: string): Promise<Connection[]> {
        return this.connectionRepository.findUserConnections(userId);
    }

    async deleteConnection(connectionId: string): Promise<boolean> {
        return this.connectionRepository.deleteConnection(connectionId);
    }
    
}