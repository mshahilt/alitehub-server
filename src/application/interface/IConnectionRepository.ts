import { Connection } from "../../domain/entities/Connection";

export interface IConnectionRepository {
    create(connection: Partial<Connection>): Promise<Connection>;
    findByUsersId(userId1: string, userId2: string): Promise<Connection | null>;
    findUserConnections(userId: string): Promise<Connection[]>;
    findCountOfUserConnections(userId: string): Promise<number>;
    updateStatus(id: string, status: 'pending' | 'accepted' | 'declined', respondedAt?: Date): Promise<Connection | null>;
    findPendingRequests(userId: string): Promise<Connection[]>;
    deleteConnection(id: string): Promise<boolean>;                                             
}