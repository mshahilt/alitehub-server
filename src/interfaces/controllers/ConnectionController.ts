import { Request, Response } from "express";
import { ConnectionUseCase } from "../../application/useCases/ConnectionUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

class ConnectionController {
    constructor(private connectionUseCase: ConnectionUseCase) {}

    async createConnection(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { userId2 } = req.body;
            const userId1 = req.userId;
            if(!userId1) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const connection = await this.connectionUseCase.createConnection(userId1, userId2);
            return res.status(201).json({ success: true, data: connection });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async acceptConnection(req: Request, res: Response): Promise<Response> {
        try {
            const { connectionId } = req.params;
            const connection = await this.connectionUseCase.acceptConnection(connectionId);
            return res.status(200).json({ success: true, data: connection });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    async declineConnection(req: Request, res: Response): Promise<Response> {
        try {
            const { connectionId } = req.params;
            const connection = await this.connectionUseCase.declineConnection(connectionId);
            return res.status(200).json({ success: true, data: connection });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    async findPendingRequests(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            if(!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const pendingRequests = await this.connectionUseCase.findPendingRequests(userId);
            return res.status(200).json({ success: true, data: pendingRequests });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    async findOwnUserConnection(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.userId as string;
            const connecitons = await this.connectionUseCase.findUserConnections(userId);
            return res.status(200).json({ success: true, data: connecitons });

        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    async findUserConnections(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const connections = await this.connectionUseCase.findUserConnections(userId);
            return res.status(200).json({ success: true, data: connections });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    async findUserConnectionsCount(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const connections = await this.connectionUseCase.findUserConnectionsCount(userId);
            return res.status(200).json({ success: true, count: connections });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async deleteConnection(req: Request, res: Response): Promise<Response> {
        try {
            const { connectionId } = req.params;
            const success = await this.connectionUseCase.deleteConnection(connectionId);
            if (!success) {
                return res.status(404).json({ success: false, message: "Connection not found" });
            }
            return res.status(200).json({ success: true, message: "Connection deleted successfully" });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export { ConnectionController };