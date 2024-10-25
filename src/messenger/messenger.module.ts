import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MessengerController],
  providers: [MessengerService, PrismaService],
  exports: [MessengerService],
})
export class MessengerModule {}
