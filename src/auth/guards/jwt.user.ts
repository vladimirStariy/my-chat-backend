import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtUserGuard implements CanActivate {

    constructor(private jwtService: JwtService,
                private userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
            if (bearer !== 'Bearer' || !token) throw new UnauthorizedException('Unauthorized')
            const valid = this.jwtService.verify(token);
            if(valid) {
                const user = await this.userService.getByEmail(valid.email);
                if(user.isBanned) throw new UnauthorizedException('You are banned')
                
                req.user = {email: user.email, userId: user.id}
            }
            return true;
        } catch (e) {
            throw new UnauthorizedException('Unauthorized')
        }
    }

}