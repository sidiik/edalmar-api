import { NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';
export declare class IpMiddleware implements NestMiddleware {
    use(req: Request, _: any, next: NextFunction): void;
}
