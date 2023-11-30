import { HttpException, 
         HttpStatus, 
         Injectable, 
         Logger, 
         UnauthorizedException,
         NotFoundException,
         ConflictException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UUIDV4 } from 'sequelize';

@Injectable()
export class UserService {

    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async createUser(email: string, password: string, username: string) {
        const defaultTag = String(UUIDV4());
        const newUser = await this.userRepository.create({ email: email, password: password, username: username, usertag: defaultTag });
        return newUser;
    }

    async modifyUser() {

    }

    async removeUser() {

    }

    async blockUser() {

    }

    async unblockUser() {

    }

    async getByUsertag(usertag: string) {
        const user = await this.userRepository.findOne({where: {usertag: usertag}})
        if(!user) throw new NotFoundException("User not found");
        return user;
    }

    async getByUsername(username: string) {
        const user = await this.userRepository.findOne({where: {username: username}})
        if(!user) throw new NotFoundException("User not found");
        return user;
    }

    async getByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email: email}, include: {all: true}})
        if(!user) throw new NotFoundException("User not found");
        return user;
    }

    async getById(id: number) {
        const user = await this.userRepository.findOne({where: {id: id}});
        if(!user) throw new NotFoundException("User not found");
        return user;
    }
}