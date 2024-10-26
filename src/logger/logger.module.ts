import { Global, Module } from '@nestjs/common';
import { DBLoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { PrismaService } from 'src/prisma.service';

@Global()
@Module({
  controllers: [LoggerController],
  providers: [DBLoggerService, PrismaService],
})
export class DbLoggerModule {}
