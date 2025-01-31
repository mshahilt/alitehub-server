import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRespository";
import bcrypt from "bcrypt";

export class CreateUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(name: string, email: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);
        if(existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User(Date.now().toString(), name, email, hashedPassword);
        return this.userRepository.create(user);
    }
}