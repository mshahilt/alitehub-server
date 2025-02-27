
import { User } from "../../domain/entities/User";

export interface IUserRepository{
    generateOtp(email: string): Promise<string>;
    verifyOtp(email: string, otp: string) : Promise<boolean>;
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>
    findByUsername(username: string): Promise<boolean>;
    findUserByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updatePassword(email: string, password: string): void;
    findAll(): Promise<User[]>
    updateUserByEmail(user:User): Promise<User | null>;
}