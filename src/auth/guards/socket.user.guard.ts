import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class SocketUserGuard implements CanActivate {

    constructor(private jwtService: JwtService,
                private userService: UserService) {}

    async canActivate(context: any): Promise<boolean> {
        const authHeader = context.args[0].handshake.headers.authorization;
        try {
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
            if (bearer !== 'Bearer' || !token) throw new UnauthorizedException({message: 'Unauthorized'})
            console.log('still work')
            const valid = this.jwtService.verify(token);
            console.log(valid)
            if(valid) {
                const user = await this.userService.getByEmail(valid.email);
                if(!user) throw new UnauthorizedException({message: 'Unauthorized'});
                if(user.isBanned) throw new UnauthorizedException({message: 'You are banned'})
            }
            return true;
        } catch (e) {
            throw new UnauthorizedException({message: 'Unauthorized'})
        }
    }
}