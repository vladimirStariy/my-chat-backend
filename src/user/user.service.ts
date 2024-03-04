import { 
  HttpException, 
  HttpStatus, 
  Injectable, 
  Logger, 
  UnauthorizedException,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}
  async createUser(email: string, password: string, username: string) {
    const defaultTag = this.generateUUID();
    const newUser = await this.userRepository.create({ username: username, email: email, password: password, usertag: defaultTag });
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
    return user;
  }
  async getByUsername(username: string) {
    const user = await this.userRepository.findOne({where: {username: username}})
    return user;
  }
  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({where: {email: email}, include: {all: true}})
    return user;
  }
  async getById(id: number) {
    const user = await this.userRepository.findOne({where: {id: id}});
    return user;
  }
  async getUsersRange(ids: number[]) {
    const users = await this.userRepository.findAll({
      where: { id: ids }
    })
    return users;
  }
  private generateUUID(): string {
    return uuidv4();
  }
}