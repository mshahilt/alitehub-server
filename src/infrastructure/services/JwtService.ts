import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "env is not working";
const JWT_EXPIRATION = '1h';

export const generateToken = (userId:string) => {
    return jwt.sign({userId},JWT_SECRET,{expiresIn:JWT_EXPIRATION});
};

const verifyToken = (token:string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch(error) {
        throw new Error('Invalid or expired token');
    }
}

export default{generateToken, verifyToken};