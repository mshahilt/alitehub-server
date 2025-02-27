import JwtService from "../../infrastructure/services/JwtService";
import { NextFunction, Request, Response } from "express";

interface DecodedToken {
    role: string;
    userId: string;
}

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authMiddleware = (requiredRole: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        try {
            const decoded = (await JwtService.verifyToken(token)) as DecodedToken;
            
            if (!decoded || decoded.role !== requiredRole) {
                return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            }
            req.userId = decoded.userId;

            next();
        } catch (error) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
    };
};
