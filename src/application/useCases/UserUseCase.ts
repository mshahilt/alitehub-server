import { User } from "../../domain/entities/User";
import { IUserRepository } from "../interface/IUserRepository";
import bcrypt from "bcrypt";
import JwtService from "../../infrastructure/services/JwtService";
import { GoogleAuthService } from "../../infrastructure/services/googleAuthService";

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
  username: string; 
}


export class UserUseCase {
    constructor(private userRepository: IUserRepository) {}
    async generateOtp(email: string): Promise<string> {
        await this.userRepository.generateOtp(email);
        return `otp generated for ${email}`;
    }
    async register(newUser: CreateUserDTO): Promise<{ user: UserResponse; accessToken: string, refreshToken: string }> {

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
    
        const user = new User({
          id: Date.now().toString(),
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          password: hashedPassword,
        });
        
    
        const createdUser = await this.userRepository.create(user);
        if (!createdUser.id) {
          throw new Error("Failed to create user");
        }
    
        const token = JwtService.generateToken(createdUser.id, "user");
        const refreshToken = JwtService.generateRefreshToken(createdUser.id, "user");
        const userResponse: UserResponse = { name: createdUser.name, email: createdUser.email, username: createdUser.username };

        return { user: userResponse, accessToken:token, refreshToken};

      }
      async googleAuthenticate(token: string) {
        const googleUser = await GoogleAuthService.verifyGoogleToken(token);

        console.log("user from google", googleUser);
        
        let user = await this.userRepository.findByEmail(googleUser.email);
        const role = "user";
        if (!user) {
          let username = googleUser.email.split('@')[0];
          let profile_picture = googleUser.avatar;
          while (!this.checkUsernameAvailability(username)) {
            username += Math.floor(1000 + Math.random() * 9000).toString(); 
          }
          user = new User({
            id: Date.now().toString(),
            name: googleUser.name,
            email: googleUser.email,
            profile_picture,
            username
          });
          const createdUser = await this.userRepository.create(user);
          if (!createdUser.id) {
            throw new Error("Failed to create user");
          }
        }
        
      
        if (!user.id) {
          throw new Error("User ID is null");
        }
        const jwtToken = JwtService.generateToken(user.id, role);
        const refreshToken = JwtService.generateRefreshToken(user.id, role);
        const userResponse: UserResponse = { name: user.name, email: user.email, username: user.username };
      
        return { user: userResponse, accessToken:jwtToken, refreshToken };
      }
      

    async userLogin(email: string, password: string) : Promise<{ user: UserResponse; accessToken: string;refreshToken:string; message:string }> {
        console.log("from use case email:",email,"password", password);
        const user = await this.userRepository.findByEmail(email);
        const role = 'user';
        console.log("user from db", user);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.password) {
            throw new Error("User password is undefined");
        }
        const isVerified = await bcrypt.compare(password, user.password);
        console.log("isVerified", isVerified);
        if(isVerified){
            if (!user.id) {
                throw new Error("User ID is null");
            }
            const accessToken = JwtService.generateToken(user.id, role);
            const refreshToken = JwtService.generateRefreshToken(user.id, role);
            const userResponse:UserResponse = {name: user.name, email: user.email, username: user.username} 
            console.log("userResponse", userResponse);
            return {user:userResponse, accessToken, refreshToken, message: `${user.name}'s account verified`};
        } else {
            throw new Error("Invalid credentials");
        }
    }
    async checkUsernameAvailability(username: string): Promise<boolean>{
        const user = await this.userRepository.findByUsername(username);
        return user;
    }
    
    async fetchProfile(token: string, username: string): Promise<{ user: UserResponse; ownUserAcc: boolean }> {
  try {
    const verifiedDetails = await JwtService.verifyToken(token);
    const authenticatedUser = await this.userRepository.findById(verifiedDetails.userId);
    
    if (!authenticatedUser) {
      throw new Error("User not found");
    }

    if (authenticatedUser.username === username) {
      return {
        user: authenticatedUser,
        ownUserAcc: true,
      };
    }

    const requestedUser = await this.userRepository.findUserByUsername(username);
    if (!requestedUser) {
      throw new Error("User not found");
    }

    return {
      user: requestedUser,
      ownUserAcc: false,
    };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
   
}