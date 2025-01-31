import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRespository";
import UserModel from "../database/models/UserModel";

export class UserRepositoryImpl implements UserRepository {
    async create(user: User): Promise<User> {
        const createdUser = await UserModel.create(User);
        return new User(createdUser.id, createdUser.name, createdUser.email, createdUser.password);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({email});
        return user ? new User(user.id, user.name, user.email, user.password) : null;
    }
}