import { Cache } from '@nestjs/cache-manager';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class RolesGuard implements CanActivate {
    private reflector;
    private cacheManager;
    constructor(reflector: Reflector, cacheManager: Cache);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
