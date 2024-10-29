import { Controller } from '@nestjs/common';
import { TravelerService } from './traveler.service';

@Controller('traveler')
export class TravelerController {
  constructor(private readonly travelerService: TravelerService) {}
}
