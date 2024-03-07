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
    const authHeader = context.args[1].token;
    try {
      if(authHeader === null || authHeader === '') throw new UnauthorizedException('Unauthorized')
      if (!authHeader) throw new UnauthorizedException('Unauthorized')
      const valid = this.jwtService.verify(authHeader);
      if(valid) {
        const user = await this.userService.getByEmail(valid.email);
        if(!user) throw new UnauthorizedException('Unauthorized');
        if(user.isBanned) throw new UnauthorizedException('You are banned')
        context.args[0].handshake.headers.userId = user.id;
        context.args[0].handshake.headers.userName = user.username;
      }
      return true;
    } catch (e) {
      throw new UnauthorizedException('Unauthorized')
    }
  }
}