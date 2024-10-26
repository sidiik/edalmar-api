import { Global, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ILog } from './logger.dto';
import { ApiException } from 'helpers/ApiException';

@Global()
@Injectable()
export class DBLoggerService {
  constructor(private readonly prismaService: PrismaService) {}

  async log(data: ILog) {
    try {
      await this.prismaService.activity_log.create({
        data: {
          user_id: data.user_id,
          action: data.action,
          description: data.description,
          ip_addres: data.metadata.clientIp,
          user_agent: data.metadata.userAgent,
          body: data.body,
        },
      });
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }
}
