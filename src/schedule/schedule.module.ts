import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { MessengerModule } from 'src/messenger/messenger.module';
import { MessengerService } from 'src/messenger/messenger.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ScheduleService, MessengerService, PrismaService],
  imports: [MessengerModule],
})
export class ScheduleMessageModule {}
