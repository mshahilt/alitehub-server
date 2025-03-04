import JwtService from "../../infrastructure/services/JwtService";
import { NextFunction, Request, Response } from "express";

interface DecodedToken {
    role: string;
    userId: string;
}

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const AuthMiddleware = (requiredRole: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers.authorization;

        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }

        try {
            const decoded = (await JwtService.verifyToken(token)) as DecodedToken;
            
            if (!decoded || decoded.role !== requiredRole) {
                res.status(403).json({ message: "Forbidden: Insufficient permissions" });
                return;
            }
            
            req.userId = decoded.userId;
            next();
        } catch (error) {
            res.status(401).json({ message: "Forbidden: Invalid token" });
            return;
        }
    };
};
