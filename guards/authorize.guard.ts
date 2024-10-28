import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { user } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as Request;

    const user = (await this.cacheManager.get(
      'USER-' + request.metadata.user,
    )) as user;

    if (!user) {
      return false;
    }

    if (requiredRoles.includes(user.role)) {
      return true;
    }

    return false;
  }
}
