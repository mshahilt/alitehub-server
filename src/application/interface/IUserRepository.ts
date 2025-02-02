import { User } from "../../domain/entities/User";

export interface IUserRepository{
    generateOtp(email: string): Promise<string>;
    verifyOtp(email: string, otp: string) : Promise<boolean>;
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>
    findByUsername(username: string): Promise<boolean>;
    confirmPassword(password:string, confirmPassword:string): boolean;
    istermsAccepted(termsAccepted:boolean): boolean;
}