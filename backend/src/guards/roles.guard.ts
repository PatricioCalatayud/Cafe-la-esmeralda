import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/enum/roles.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiresRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiresRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const hasRole = () => requiresRoles.some((role) => user.roles?.includes(role));
        const valid = user && user.roles && hasRole();

        if (!valid) throw new ForbiddenException('Acceso no autorizado.');

        return valid;
    }
}