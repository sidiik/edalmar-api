import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { PrismaService } from 'src/prisma.service';
import { DBLoggerService } from 'src/logger/logger.service';
import { AgencyModule } from 'src/agency/agency.module';
import { BookingModule } from 'src/booking/booking.module';
import { AuthModule } from 'src/auth/auth.module';
import { MessengerModule } from 'src/messenger/messenger.module';

@Module({
  controllers: [TicketController],
  providers: [TicketService, PrismaService, DBLoggerService],
  imports: [AgencyModule, BookingModule, AuthModule, MessengerModule],
})
export class TicketModule {}
