import { Request, Response } from "express";
import { UserUseCase } from "../../application/useCases/UserUseCase";
import JwtService from "../../infrastructure/services/JwtService";
import { ConnectionUseCase } from "../../application/useCases/ConnectionUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";


export class UserController {
    constructor(private userCase: UserUseCase, private connectionUseCase : ConnectionUseCase) {}
    async generateOtp(req: Request, res: Response): Promise<Response> {
        try {
            const {email} = req.body;
            const data = await this.userCase.generateOtp(email);
            return res.status(200).json({ message: "OTP sent successfully", data });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }
    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const {name, email, password, username, confirmPassword,termsAccepted, otp } = req.body;
            const response = await this.userCase.register({name:name, username:username, email:email, password:password, confirmPassword: confirmPassword, termsAccepted:termsAccepted, otp:otp});
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                secure:false,
                maxAge:30*24*60*60*1000
            })
            return res.status(201).json({message:"User Created Successfully", response});
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }

  
    async loginUser(req: Request, res: Response): Promise<Response> {
        try{
            const {email, password} = req.body;
            console.log("email:",email,"password", password);
            const response = await this.userCase.userLogin(email, password);
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                secure:false,
                maxAge:30*24*60*60*1000
            })
            console.log("user from login ", response)
            return res.status(200).json({ message: "User Verified Successfully", response });

        }catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }
    async googleAuth(req: Request, res: Response) {
        try {
            const {token} = req.body;
            console.log("google auth", req.body);
            console.log(token);
            if (!token) return res.status(400).json({ message: "Token is required" });

            const response = await this.userCase.googleAuthenticate(token);
            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                secure:false,
                maxAge:30*24*60*60*1000
            })
            return res.status(200).json({message:"Google authanticated successfully", response});

        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }
    async checkUsernameAvailability(req: Request, res: Response): Promise<Response> {
        try{
            const {username} = req.query;
            console.log("user name got it at controller", username)
            if (typeof username !== 'string') {
                return res.status(400).json({message: "Invalid username"});
            }
            const isAvailable = await this.userCase.checkUsernameAvailability(username);
            console.log(isAvailable)
            return res.status(200).json({message: "Username is available", data: isAvailable});
        }catch(error){
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            console.log("error on checkUsernameAvailability", error)
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }
    async fetchProfile(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const token = req.headers.authorization;
            const { username } = req.params;
            const userId = req.userId;
            if(!userId) {
                throw new Error("User not authenticated");
            }
    
            if (!token) {
                return res.status(401).json({ message: "Authorization token is missing" });
            }
    
            const data = await this.userCase.fetchProfile(token, username);

            const connectionInfo = await this.connectionUseCase.findUsersConnection(userId,data.user.id);
    
            return res.status(200).json({
                message: "Profile fetched successfully",
                user: data.user,
                ownAccount: data.ownUserAcc,
                connectionInfo,
            });
    
        } catch (error: any) {
            console.error("Error in fetchProfile:", error);
            return res.status(error.statusCode || 500).json({
                message: error.message || "An unknown error occurred"
            });
        }
    }
    

    async fetchUserUsingToken(req: Request, res: Response): Promise<Response> {
        try {
            console.log("i am called");
            const token = req.headers.authorization;
            console.log("Authorization token:", token);
    
            if (!token) {
                console.log("Authorization token is missing");
                return res.status(401).json({ message: "Authorization token is missing" });
            }
    
            const data = await this.userCase.fetchUserUsingToken(token);
            console.log("Data in fetchUserUsingToken:", data);
            return res.status(200).json({
                message: "User data fetched successfully",
                user: data.user,
            });
    
        } catch (error: any) {
            console.log("Error in fetchUserUsingToken:", error);
            return res.status(error.statusCode || 500).json({ 
                message: error.message || "An unknown error occurred" 
            });
        }
    }
    
    async refreshToken(req: Request, res: Response): Promise<Response> {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(403).json({ message: "Refresh token missing" });
            }

            const verifiedDetails = await JwtService.verifyToken(refreshToken);
            if (!verifiedDetails) {
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }

            const { userId, role } = verifiedDetails;
            const newAccessToken = JwtService.generateToken(userId, role);
            
            return res.json({ accessToken: newAccessToken });

        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            console.log("error on checkUsernameAvailability", error)
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }
    async forgotPassword(req: Request, res: Response): Promise<Response> {
        try{
            const {email} = req.body;
            const response = await this.userCase.forgotPassword(email);
            console.log("response at forgot password", response)
            return res.status(200).json({message:"Email sent successfully", response});
        }catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message, success:true});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }
    async resetPassword(req: Request, res: Response): Promise<Response> {
        try {
            const { email, otp, newPassword, confirmPassword } = req.body;
            const response = await this.userCase.resetPassword(email, otp, newPassword, confirmPassword);
            return res.status(200).json({ message: response.message, success:true });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: "An unknown error occurred" });
        }
    }
    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try{
            const data = await this.userCase.fetchAllUsers();
            return res.status(200).json({ message: "data fethed successfully", success:true, data });
        } catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: "An unknown error occurred" });
        }
    }
    async updateProfile(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.body;
            const response = await this.userCase.updateProfile(user);
            return res.status(200).json({ message: "Success", user:response});
        } catch (error) { 
            return res.status(400).json({ message: "An unknown error occurred" });
        }
    }
    async getSignedUploadUrl(req: Request, res: Response) {
        try {
            const token = req.headers.authorization;
            const resource_type = req.query.resource_type as string;
            console.log("Resource Type:", resource_type);
            if (!token) {
                return res.status(401).json({ message: "Authorization token is missing" });
            }
            const response = await this.userCase.generateSignUploadUrl(token, resource_type);
            return res.status(200).json({
                message: "Cloudinary Signature Generated",
                signedUrl: response,
            });

        } catch (error: any) {
            console.error("Error in generating signed url:", error);
            return res.status(error.statusCode || 500).json({
                message: error.message || "An unknown error occurred"
            });
        }
    }
    async uploadIntroductionVideo(req: Request, res: Response) {
        try {
            const token: string = req.headers.authorization as string;
            const verifiedDetails = await JwtService.verifyToken(token);
            if (!verifiedDetails) {
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }
            console.log("verifiedDetails", verifiedDetails);

            const { userId } = verifiedDetails;
            console.log(userId);
            if(!req.body) {
                return res.status(400).json({message: "Invalid Video Url.!"});
            }
            const {videoUrl} = req.body;
            console.log("video url",videoUrl);

            if(!videoUrl) {
                return res.status(400).json({message: "Failed to upload video url"});
            }

            const user: any = {
                id:userId,
                video_url: videoUrl 
            };
            console.log("user controller", user )

            const response = await this.userCase.updateProfile(user);
            console.log("response in controller", response)

            return res.status(200).json({message: "File uploaded successfully", videoUrl, response})
            } catch (error: any) {
            console.log("Error in getching company jobs: ", error);
    
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
    async updateResume(req: Request, res: Response): Promise<Response> {
        try {
            const token: string = req.headers.authorization as string;
            const verifiedDetails = await JwtService.verifyToken(token);
            if (!verifiedDetails) {
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }

            const { userId } = verifiedDetails;
            if(!req.file) {
                return res.status(400).json({message: "Invalid file. Only PDFs allowed!"});
            }
            const fileUrl = (req.file as any).location;
            console.log("file url",fileUrl);

            if(!fileUrl) {
                return res.status(400).json({message: "Failed to upload url"});
            }

            const user: any = {
                id:userId,
                resume_url: fileUrl 
            };

            const response = await this.userCase.updateProfile(user);

            return res.status(200).json({message: "File uploaded successfully", fileUrl, response})
            } catch (error: any) {
            console.log("Error in getching company jobs: ", error);
    
            return res.status(error.status || 500).json({
                message: error.message || "An unknown error occurred",
            });
        }
    }
}