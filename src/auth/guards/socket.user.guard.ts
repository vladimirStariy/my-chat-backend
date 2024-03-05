import { CanActivate, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class SocketUserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}
  async canActivate(context: any): Promise<boolean> {
    const authHeader = context.args[0].handshake.headers.authorization;
    try {
      if(authHeader === null || authHeader === '') throw new UnauthorizedException({message: 'Unauthorized'})
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]
      if (bearer !== 'Bearer' || !token) throw new UnauthorizedException({message: 'Unauthorized'})
      const valid = this.jwtService.verify(token);
      if(valid) {
        const user = await this.userService.getByEmail(valid.email);
        if(!user) throw new UnauthorizedException({message: 'Unauthorized'});
        if(user.isBanned) throw new UnauthorizedException({message: 'You are banned'})
        context.args[0].handshake.headers.userId = user.id;
        context.args[0].handshake.headers.userName = user.username;
      }
      return true;
    } catch (e) {
      throw new UnauthorizedException({message: 'Unauthorized'})
    }
  }
}