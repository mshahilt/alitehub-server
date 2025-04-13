import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../application/interface/IUserRepository";
import UserModel from "../database/models/UserModel";
import OtpModel from "../database/models/OtpModel";
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
        const user = await UserModel.findById(userId).select("-password");
        return user ? new User({ id: user.id, name: user.name, username: user.username, email: user.email, is_active: user.is_active, about: user.about, contact: user.contact, education: user.education, skills: user.skills,profile_picture: user.profile_picture, experience: user.experience, resume_url: user.resume_url, video_url: user.video_url, isBlocked: user.isBlocked }) : null;
    }    
    
    async create(user:User): Promise<User> {
        const createdUser = await UserModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            username: user.username,
            profile_picture: user.profile_picture,
        });
        return new User({id:createdUser.id, name:createdUser.name, username:createdUser.username,is_active: user.is_active, about: user.about, email:createdUser.email, password:createdUser.password});
    }

    async findUserByUsername(username: string): Promise<User | null> {
        const user = await UserModel.findOne({username});
        return user ? new User({ id: user.id, name: user.name, username: user.username, email: user.email,is_active: user.is_active, about: user.about, contact: user.contact, education: user.education, skills: user.skills, experience: user.experience,profile_picture:user.profile_picture, resume_url: user.resume_url, video_url: user.video_url }) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        console.log(`Finding user by email: ${email}`);
        const user = await UserModel.findOne({ email });
        console.log(`User found: ${user}`);
        return user ? new User({id:user.id, name:user.name, profile_picture: user.profile_picture,is_active: user.is_active, about: user.about, username:user.username, email:user.email, password:user.password}) : null;
    }

    async findByUsername(username: string): Promise<boolean> {
        const user = await UserModel.findOne({ username });
        return user ? false : true;
    }
    async updatePassword(email: string, password: string): Promise<void> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        user.password = password;
        await user.save();
    }
    async findAll(): Promise<User[]> {
        const users = await UserModel.find();
    
        if (users.length === 0) {
            throw new Error("Users not found");
        }
    
        return users.map(user => new User({ id: user.id, name: user.name, profile_picture: user.profile_picture,is_active: user.is_active, about: user.about, username: user.username, email: user.email }));
    }
    async updateUserByEmail(user: User): Promise<User | null> {
        const updatedUser = await UserModel.findOneAndUpdate(
            { 
                $or: [
                    { email: user.email }, 
                    { _id: user.id }
                ] 
            },
            {
                name: user.name,
                about: user.about,
                username: user.username,
                contact: user.contact,
                profile_picture: user.profile_picture,
                resume_url: user.resume_url,
                video_url: user.video_url,
                job_types: user.job_types,
                industries: user.industries,
                skills: user.skills,
                education: user.education?.map(edu => ({
                    institution: edu.institution,
                    degree: edu.degree,
                    start_date: edu.start_date,
                    end_date: edu.end_date,
                })),
                experience: user.experience?.map(exp => ({
                    company: exp.company,
                    title: exp.title,
                    description: exp.description,
                    start_date: exp.start_date,
                    end_date: exp.end_date,
                })),
                updated_at: new Date(), 
            },
            { new: true, runValidators: true }
        );
    
        if (!updatedUser) {
            throw new Error("User not found");
        }
    
        return updatedUser ? new User({
            id: updatedUser._id.toString(),
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            contact: updatedUser.contact,
            profile_picture: updatedUser.profile_picture,
            resume_url: updatedUser.resume_url,
            video_url: updatedUser.video_url,
            job_types: updatedUser.job_types,
            industries: updatedUser.industries,
            skills: updatedUser.skills,
            education: updatedUser.education,
            experience: updatedUser.experience,
            updated_at: updatedUser.updated_at,
        }) : null;
    }
}