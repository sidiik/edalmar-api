import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { PrismaService } from 'src/prisma.service';
import { DBLoggerService } from 'src/logger/logger.service';

@Module({
  controllers: [AgencyController],
  providers: [AgencyService, PrismaService, DBLoggerService],
  imports: [],
})
export class AgencyModule {}
