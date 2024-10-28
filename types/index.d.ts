import { user } from '@prisma/client';

declare module 'express' {
  interface Request {
    metadata: {
      clientIp?: string;
      userAgent?: string;
      user?: number;
      deviceId?: string;
      userData?: user;
    };
  }
}
