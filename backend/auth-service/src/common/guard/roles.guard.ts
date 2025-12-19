
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserRole } from '../constant/user-role';
import { JwtPayload } from '../types/JwtPayload';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        // Check if user exists and has a role
        if (!user || !user.role) {
            throw new ForbiddenException('User role not found');
        }

        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            throw new ForbiddenException('Insufficient permissions');
        }
        return true;
    }
}
