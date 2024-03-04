import { HttpException, ConflictException, HttpStatus, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { User } from 'src/user/models/user.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, 
    private jwtService: JwtService
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const pairTokens = await this.generatePairToken(user);
    return pairTokens;
  }
  async register(registerDto: RegisterDto) {
    try {
      if(!await this.validateUserEmail(registerDto.email)) throw new Error("User with the same email already exist.")
      if(!await this.validateUsername(registerDto.username)) throw new Error("User with the same username already exist.")
      const hashPassword = await bcrypt.hash(registerDto.password, 5);
      await this.userService.createUser(registerDto.email, hashPassword, registerDto.username);
      return HttpStatus.OK;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async refresh(refreshToken: string) {
    const isValid = await this.jwtService.verifyAsync(refreshToken)
    if(isValid) {
      const user = await this.userService.getByEmail(isValid.email);
      const pairTokens = this.generatePairToken(user);
      return pairTokens;
    }
  }
  private async generatePairToken(user: User) {
    const payload = { email: user.email, isAdmin: user.isAdmin }
    const accessToken = await this.jwtService.signAsync(payload, {algorithm: 'HS256'})
    const refreshToken = await this.jwtService.signAsync(payload, {algorithm: 'HS256', expiresIn: '7d'})
    return { accessToken, refreshToken }
  }
  async validateUser(loginDto: LoginDto) {
    try {
      const user = await this.userService.getByEmail(loginDto.email);
      if(!user) throw new Error("Invalid email")
      if(user.isBanned) throw new Error("User is banned");
      const passwordEquals = await bcrypt.compare(loginDto.password, user.password);
      if(!passwordEquals) throw new Error("Invalid password");
      return user;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  private async validateUserEmail(email: string) {
    const user = await this.userService.getByEmail(email);
    if(user) return false;
    return true;
  }
  private async validateUsername(username: string) {
    const user = await this.userService.getByUsername(username)
    if(user) return false;
    return true;
  }
}

