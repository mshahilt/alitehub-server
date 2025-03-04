import { Connection } from "../../domain/entities/Connection";

export interface IConnectionRepository {
    create(connection: Partial<Connection>): Promise<Connection>;
    findByUsersId(userId1: string, userId2: string): Promise<Connection | null>;
    findUserConnections(userId: string): Promise<Connection[]>;
    updateStatus(id: string, status: 'Pending' | 'Accepted' | 'Declined', respondedAt?: Date): Promise<Connection | null>;
    findPendingRequests(userId: string): Promise<Connection[]>;
    deleteConnection(id: string): Promise<boolean>;                                             
}