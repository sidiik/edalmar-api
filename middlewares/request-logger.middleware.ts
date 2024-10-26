import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    const startTime = Date.now();

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - startTime;

      let logMethod = this.logger.log;

      if (statusCode >= 500) {
        logMethod = this.logger.error;
      } else if (statusCode >= 400) {
        logMethod = this.logger.warn;
      }

      logMethod.call(
        this.logger,
        JSON.stringify({
          timestamp: dayjs().format('DD-MM-YYYYTHH:mm:ss'),
          method,
          url: originalUrl,
          status: statusCode,
          responseTime: `${responseTime}ms`,
          contentLength: contentLength || 'N/A',
          userAgent,
          ip: ip,
          userId: req?.metadata?.user || 'N/A',
        }),
      );
    });

    next();
  }
}
