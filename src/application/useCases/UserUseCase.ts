import { User } from "../../domain/entities/User";
import { IUserRepository } from "../interface/IUserRepository";
import bcrypt from "bcrypt";
import JwtService from "../../infrastructure/services/JwtService";
import { GoogleAuthService } from "../../infrastructure/services/googleAuthService";
import { Job } from "../../domain/entities/Job";
import { GenerateQuizAiService } from "../../infrastructure/services/GeminiAiModelService";
import { error } from "console";
import { cloudinaryConfig, cloudinarySignature } from "../../infrastructure/config/cloudinaryConfig";

export interface CreateUserDTO {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
    otp: string;
}
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  username: string; 
  isBlocked?: boolean;
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
        const userResponse: UserResponse = {id: createdUser.id, name: createdUser.name, email: createdUser.email, username: createdUser.username };

        return { user: userResponse, accessToken:token, refreshToken};

      }
      async googleAuthenticate(token: string) {
        const googleUser = await GoogleAuthService.verifyGoogleToken(token);
        
        let user = await this.userRepository.findByEmail(googleUser.email);
        const role = "user";
        if (!user) {
          let username = googleUser.email.split('@')[0];
          let profile_picture = googleUser.avatar;
          while (!this.checkUsernameAvailability(username)) {
            username += Math.floor(1000 + Math.random() * 9000).toString(); 
          }
          user = new User({
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
        const userResponse: UserResponse = {id: user.id, name: user.name, email: user.email, username: user.username };
      
        return { user: userResponse, accessToken:jwtToken, refreshToken };
      }
      

    async userLogin(email: string, password: string) : Promise<{ user: UserResponse; accessToken: string;refreshToken:string; message:string }> {
        const user = await this.userRepository.findByEmail(email);
        const role = 'user';
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.password) {
            throw new Error("User password is undefined");
        }
        const isVerified = await bcrypt.compare(password, user.password);
        if(isVerified){
            if (!user.id) {
                throw new Error("User ID is null");
            }
            const accessToken = JwtService.generateToken(user.id, role);
            const refreshToken = JwtService.generateRefreshToken(user.id, role);
            const userResponse:UserResponse = {id: user.id,name: user.name, email: user.email, username: user.username} 
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
          if (!verifiedDetails?.userId) {
              const error: any = new Error("Invalid token");
              error.statusCode = 401;
              throw error;
          }
  
          const authenticatedUser = await this.userRepository.findById(verifiedDetails.userId);
          if (!authenticatedUser) {
              const error: any = new Error("User not found");
              error.statusCode = 401;
              throw error;
          }
  
          if (authenticatedUser.username === username) {
              return {
                  user: authenticatedUser,
                  ownUserAcc: true,
              };
          }
  
          const requestedUser = await this.userRepository.findUserByUsername(username);
          if (!requestedUser) {
              const error: any = new Error("User not found");
              error.statusCode = 404;
              throw error;
          }
  
          return {
              user: requestedUser,
              ownUserAcc: false,
          };
  
      } catch (error: any) {
          console.error("Error in fetchProfile:", error);
  
          if (!error.statusCode) {
              error.statusCode = 401; 
          }
  
          throw error;
      }
  }
  
  async fetchUserUsingToken(token: string): Promise<{ user: UserResponse }> {
    try {
        const verifiedDetails = await JwtService.verifyToken(token);
        if (!verifiedDetails?.userId) {
            const error: any = new Error("Invalid token");
            error.statusCode = 401;
            throw error;
        }

        const authenticatedUser = await this.userRepository.findById(verifiedDetails.userId);

        if (!authenticatedUser) {
            const error: any = new Error("User not found");
            error.statusCode = 400;
            throw error;
        }

        return { user: authenticatedUser };
    } catch (error: any) {
        console.error("Error in fetchUserUsingToken:", error);

        if (!error.statusCode) {
            error.statusCode = 401;
        }

        throw error;
    }
}
  async forgotPassword(email: string): Promise<{ user: UserResponse }> {
    try {
      const fetchedUser = await this.userRepository.findByEmail(email);
      if (!fetchedUser) {
        throw new Error("User not found");
      }
      await this.userRepository.generateOtp(email);
      const userResponse: UserResponse = {id: fetchedUser.id, name: fetchedUser.name, email: fetchedUser.email, username: fetchedUser.username };
      console.log("from forgot password", userResponse);
      return { user: userResponse };
    } catch (error: any) {
      console.error("Error in forgotPassword:", error);
      throw error;
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string, confirmPassword: string): Promise<{ message: string }> {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const isOtpValid = await this.userRepository.verifyOtp(email, otp);
      if (!isOtpValid) {
        throw new Error("OTP verification failed");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.updatePassword(email, hashedPassword);

      return { message: "Password reset successfully" };
    } catch (error: any) {
      console.error("Error in resetPassword:", error);
      throw error;
    }
  }

  async fetchAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.findAll();
      return users;
    } catch (error: any) {
      console.error("Error in fetchAllUsers:", error);
      throw error;
    }
  }

  async updateProfile(user:User): Promise<UserResponse | null> {
    try {
      const updatedUser = this.userRepository.updateUserByEmail(user);
      if (!updatedUser) {
        const error: any = new Error("User not found");
        error.statusCode = 400;
        throw error;
      }
      console.log("updated user here")
      return updatedUser

    } catch (error) {
      console.error("Error in fetchAllUsers:", error);
      throw error;
    }
  }
  async generateSignUploadUrl(token: string, resource_type: string) {
    try {
        const verifiedDetails = await JwtService.verifyToken(token);
        if (!verifiedDetails?.userId) {
            throw Object.assign(new Error("Invalid token"), { statusCode: 400 });
        }

        const cloudName = process.env.CLOUDINARY_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;

        if (!cloudName || !apiKey) {
            throw Object.assign(new Error("Cloudinary credentials are missing"), { statusCode: 500 });
        }

        const timestamp: number = Math.round(new Date().getTime() / 1000);
        
        const signature = cloudinarySignature(timestamp);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resource_type}/upload/`;

        return {
            signature,
            cloud_name: cloudName,
            api_key: apiKey,
            timestamp,
            upload_url: uploadUrl
        };
    } catch (error) {
        console.error("Error generating signed upload URL:", error);
        throw error;
    }
    }

}