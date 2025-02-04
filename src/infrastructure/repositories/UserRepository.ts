import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../application/interface/IUserRepository";
import UserModel from "../database/models/UserModel";
import OtpModel from "../database/models/otpModel";
import { Otp } from "../../domain/entities/Otp";
import { EmailService } from "../services/EmailService";


export class UserRepositoryImpl implements IUserRepository {

    async generateOtp(email: string): Promise<string> {
        const generatedOtp = Otp.generate(email);
    
        if (!generatedOtp || !generatedOtp.code || !generatedOtp.expiresAt) {
            throw new Error("Failed to generate OTP");
        }
    
        try {
            await OtpModel.deleteMany({ email });
    
            const generatedAndSavedOtp = await OtpModel.create({
                code: generatedOtp.code,
                email: generatedOtp.email,
                expiresAt: generatedOtp.expiresAt
            });
    
            await EmailService.sendOtp(email, generatedAndSavedOtp.code);
    
            return `OTP generated and sent to ${generatedAndSavedOtp.email}`;
        } catch (error) {
            console.error("Error saving OTP:", error);
            throw new Error("Could not save OTP to the database");
        }
    }
    
    async verifyOtp(email: string, otp: string): Promise<boolean> {
       
        try {
            const existingOtp = await OtpModel.findOne({ email, code: otp });
            
            if (!existingOtp) {
                return false;
            }
            
            if (new Date() > existingOtp.expiresAt) {
                await OtpModel.deleteOne({ _id: existingOtp._id });
                return false;
            }
            
            await OtpModel.deleteOne({ _id: existingOtp._id });
            
            return true;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            return false;
        }
    }
    async findById(userId: string): Promise<User | null> {
        const user = await UserModel.findById(userId);
        return user ? new User(user.id, user.name, user.username, user.email, user.password) : null;
    }
    
    async create(user: User): Promise<User> {
        const createdUser = await UserModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            username: user.username
        });
        return new User(createdUser.id, createdUser.name, createdUser.username, createdUser.email, createdUser.password);
    }



    async findByEmail(email: string): Promise<User | null> {
        console.log(`Finding user by email: ${email}`);
        const user = await UserModel.findOne({ email });
        console.log(`User found: ${user}`);
        return user ? new User(user.id, user.name, user.username, user.email, user.password) : null;
    }

    async findByUsername(username: string): Promise<boolean> {
        const user = await UserModel.findOne({ username });
        return user ? false : true;
    }
}