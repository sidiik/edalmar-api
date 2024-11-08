import { Module } from '@nestjs/common';
import { TravelerService } from './traveler.service';
import { TravelerController } from './traveler.controller';
import { AgencyModule } from 'src/agency/agency.module';
import { PrismaService } from 'src/prisma.service';
import { DBLoggerService } from 'src/logger/logger.service';

@Module({
  controllers: [TravelerController],
  providers: [TravelerService, PrismaService, DBLoggerService],
  imports: [AgencyModule],
})
export class TravelerModule {}
