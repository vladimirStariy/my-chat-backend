import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JsonWebTokenError, JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { ROLES_KEY } from "../roles.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private jwtService: JwtService,
                private reflector: Reflector,
                private userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])

            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
            if (bearer !== 'Bearer' || !token) throw new UnauthorizedException({message: 'Unauthorized'})
            const valid = this.jwtService.verify(token);
            if(valid) {
                const user = await this.userService.getByEmail(valid.email);
                if(user.isBanned) throw new UnauthorizedException({message: 'Banned'})
                req.user = {email: user.email, userId: user.id}
                if (!requiredRoles) {
                    return true;
                } else {
                    if(requiredRoles[0] === "ADMIN") {
                        if(!user.isAdmin) throw new UnauthorizedException({message: 'Unauthorized'})
                        return true
                    }
                }
            }
            return true;
        } catch (e) {
            throw new UnauthorizedException({message: 'Unauthorized'})
        }
    }

}