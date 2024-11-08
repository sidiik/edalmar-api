import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { DBLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';
import { AgencyModule } from 'src/agency/agency.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService, DBLoggerService, PrismaService],
  imports: [AgencyModule],
  exports: [BookingService],
})
export class BookingModule {}
