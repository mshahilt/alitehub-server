import JwtService from "../../infrastructure/services/JwtService";
import { NextFunction, Request, Response } from "express";

interface DecodedToken {
    role: string;
    userId: string;
}

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const AuthMiddleware = (requiredRole: string) => 
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers.authorization;
        if (!token) return void res.status(401).json({ message: "Unauthorized: No token provided" });

        try {
            const decoded = await JwtService.verifyToken(token) as DecodedToken;
            console.log("decoded :", decoded);
            if (!decoded || (requiredRole === "both" ? !["user", "company", "admin"].includes(decoded.role) : decoded.role !== requiredRole)) {
                return void res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            }
            
            req.userId = decoded.userId;
            next();
        } catch {
            res.status(401).json({ message: "Forbidden: Invalid token" });
        }
    };
