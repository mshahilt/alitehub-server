import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "env is not working";
const JWT_EXPIRATION = "15m";
const JWT_REFRESH_EXPIRATION = '7d'

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const generateRefreshToken = (userId: string, role: string): string => {
    return jwt.sign({userId, role},JWT_SECRET, {expiresIn: JWT_REFRESH_EXPIRATION});
}


export const verifyToken = async (token: string): Promise<any> => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            throw { status: 401, message: "Token expired" };
        } else if (err instanceof JsonWebTokenError) {
            throw { status: 401, message: "Invalid token" };
        }
        throw { status: 500, message: "Internal server error" };
    }
};

export default { generateToken, verifyToken, generateRefreshToken };
