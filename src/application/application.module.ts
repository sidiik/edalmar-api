import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaService } from 'src/prisma.service';
import { DBLoggerService } from 'src/logger/logger.service';
import { AgencyService } from 'src/agency/agency.service';

@Module({
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    PrismaService,
    DBLoggerService,
    AgencyService,
  ],
})
export class ApplicationModule {}
