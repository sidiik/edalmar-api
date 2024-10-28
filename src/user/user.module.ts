import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { DBLoggerService } from 'src/logger/logger.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, DBLoggerService],
})
export class UserModule {}
