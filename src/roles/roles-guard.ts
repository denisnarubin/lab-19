import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user?.roles) {
      return false;
    }

    if (typeof user.roles[0] === 'string') {
      return requiredRoles.some((role) => user.roles.includes(role));
    }

    return requiredRoles.some((role) =>
      user.roles.map((r: any) => r.name).includes(role),
    );
  }
}
