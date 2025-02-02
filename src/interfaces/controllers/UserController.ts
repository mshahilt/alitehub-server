import { Request, Response } from "express";
import { UserUseCase } from "../../application/useCases/UserUseCase";


export class UserController {
    constructor(private userCase: UserUseCase) {}
    async generateOtp(req: Request, res: Response): Promise<Response> {
        try {
            const {email} = req.body;
            const data = await this.userCase.generateOtp(email);
            return res.status(201).json({message:"User created successfully",data})
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
            console.log(otp,"I am here 1");
            console.log("req.body",req.body);
            const user = await this.userCase.register({name:name, username:username, email:email, password:password, confirmPassword: confirmPassword, termsAccepted:termsAccepted, otp:otp});
            return res.status(201).json({message:"User Creted Successfully", user});
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
}