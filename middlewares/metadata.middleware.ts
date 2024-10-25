import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req: Request, _: any, next: NextFunction) {
    const ip =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      req.ip;

    const userAgent = req.headers['user-agent'];

    req.metadata = {
      userAgent,
      clientIp: ip as string,
      deviceId: req.cookies['device_id'],
    };

    next();
  }
}
