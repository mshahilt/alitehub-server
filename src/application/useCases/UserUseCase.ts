import { User } from "../../domain/entities/User";
import { IUserRepository } from "../interface/IUserRepository";
import bcrypt from "bcrypt";
import JwtService from "../../infrastructure/services/JwtService";

interface CreateUserDTO {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
    otp: string;
}
interface UserResponse {
    name: string;
    email: string;
}


export class UserUseCase {
    constructor(private userRepository: IUserRepository) {}
    async generateOtp(email: string): Promise<string> {
        const otp = this.userRepository.generateOtp(email);
        return otp
    }
    async register(newUser: CreateUserDTO): Promise<{ user: UserResponse; token: string }> {

        if (newUser.password !== newUser.confirmPassword) {
          throw new Error("Passwords do not match");
        }
    
        if (!newUser.termsAccepted) {
          throw new Error("Terms must be accepted");
        }
    
        const existingUser = await this.userRepository.findByEmail(newUser.email);
        if (existingUser) {
          throw new Error("User already exists");
        }
    
        const isOtpValid = await this.userRepository.verifyOtp(newUser.email, newUser.otp);
        if (!isOtpValid) {
          throw new Error("OTP verification failed");
        }
    
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
    
        const user = new User(
          Date.now().toString(),
          newUser.name,
          newUser.username,
          newUser.email,
          hashedPassword
        );
    
        const createdUser = await this.userRepository.create(user);
        if (!createdUser.id) {
          throw new Error("Failed to create user");
        }
    
        const token = JwtService.generateToken(createdUser.id);
        const userResponse: UserResponse = { name: createdUser.name, email: createdUser.email };

        return { user: userResponse, token };

      }
    async checkUsernameAvailability(username: string): Promise<boolean> {
        const user = await this.userRepository.findByUsername(username);
        return user;
    }
}