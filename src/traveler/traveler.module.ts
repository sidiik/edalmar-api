import { Module } from '@nestjs/common';
import { TravelerService } from './traveler.service';
import { TravelerController } from './traveler.controller';
import { AgencyModule } from 'src/agency/agency.module';

@Module({
  controllers: [TravelerController],
  providers: [TravelerService],
  imports: [AgencyModule],
})
export class TravelerModule {}
