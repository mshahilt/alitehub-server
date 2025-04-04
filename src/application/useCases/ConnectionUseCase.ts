import { Connection } from "../../domain/entities/Connection";
import { sendNotification } from "../../infrastructure/config/rabbitmqConfig";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepository";
import { IConnectionRepository } from "../interface/IConnectionRepository";

export class ConnectionUseCase {
    constructor(private connectionRepository: IConnectionRepository, private userRepository: UserRepositoryImpl) {}

    async createConnection(userId1: string, userId2: string): Promise<Connection> {
        const connection = await this.connectionRepository.findByUsersId(userId1, userId2);
        if (connection) {
            throw new Error("Connection already exists");
        }


        const result =  await this.connectionRepository.create({userId1, userId2, status: "pending", requestedAt: new Date()});
        const user = await this.userRepository.findById(userId1);
        if (!user) {
            throw new Error("User not found");
        }
        const { username } = user;
        await sendNotification({
            receiverId: userId2,
            senderId: userId1,
            type: "connection_request",
            message: `${username} sent you a connection request.`,
        });
        return result;
    }

    async findUsersConnection(userId1: string, userId2: string): Promise<Connection | null> {
        const connection = this.connectionRepository.findByUsersId(userId1, userId2);
        return connection;
    }

    async acceptConnection(connectionId: string): Promise<Connection> {
        const connection = await this.connectionRepository.updateStatus(connectionId, "accepted", new Date());
        if (!connection) {
            throw new Error("Connection not found");
        }
        await sendNotification({
            receiverId: connection.userId1,
            type: "connection_request",
            message: `User sareena sent you a connection request.`,
        });
        return connection;
    }

    async declineConnection(connectionId: string): Promise<Connection> {
        const connection = await this.connectionRepository.updateStatus(connectionId, "declined", new Date());
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
    async findUserConnectionsCount(userId: string): Promise<number> {
        return this.connectionRepository.findCountOfUserConnections(userId);
    }

    async deleteConnection(connectionId: string): Promise<boolean> {
        return this.connectionRepository.deleteConnection(connectionId);
    }
    
}