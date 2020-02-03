import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRegisterRequest} from "../payload/UserRegisterRequest";
import {User} from "../entity/User";
import {UserAlreadyExistsError} from "../error/UserAlreadyExistsError";
import {UserRepository} from "../repository/UserRepository";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: UserRepository
    ) {
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async register(model: UserRegisterRequest): Promise<User> {
        if (await this.userRepository.findByUsername(model.username)) {
            throw new UserAlreadyExistsError();
        }

        model.password = bcrypt.hashSync(model.password, 10);

        return this.userRepository.save(Object.assign(new User(), model));
    }

    async findByUsername(username: string): Promise<User> {
        return this.userRepository.findByUsername(username);
    }
}
