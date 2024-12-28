import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../../common/const/user/USER_ROLES';
import { ROLES_KEY } from '../../decorators/role.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,
    ) {
        super();
    }

    private requireRoles:string[];

    canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        this.requireRoles = requiredRoles;

        return super.canActivate(context);
    }


    handleRequest(err:Error, user:any, info:any) {
        if (err || !user || !this.requireRoles.some((r) => user.roles.includes(r))) {
            throw err || new UnauthorizedException();
        }

        return user;
    }
}
