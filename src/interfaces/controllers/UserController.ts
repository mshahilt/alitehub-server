import { Request, Response } from "express";
import { CreateUserUseCase } from "../../application/useCases/CreateUserUseCase";

export class UserController {
    constructor(private createUserCase: CreateUserUseCase) {}

    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const {name, email, password} = req.body;
            const user = await this.createUserCase.execute(name, email, password);
            return res.status(201).json({message:"User Creted Successfully", user});
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({message: error.message});
            }
            return res.status(400).json({message: "An unknown error occurred"});
        }
    }
}