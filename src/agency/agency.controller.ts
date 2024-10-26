import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'guards/jwt.guard';
import {
  ICreateAgency,
  ILinkAgent,
  IListAgencyFilters,
  IUpdateAgency,
} from './agency.dto';
import { AgencyService } from './agency.service';
import { Request } from 'express';

@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  createAgency(@Body() data: ICreateAgency, @Req() req: Request) {
    return this.agencyService.createAgency(data, req);
  }

  @Put('update')
  @UseGuards(AuthGuard)
  updateAgency(@Body() data: IUpdateAgency, @Req() req: Request) {
    return this.agencyService.updateAgency(data, req);
  }

  @Post('link-agent')
  @UseGuards(AuthGuard)
  linkAgent(@Body() data: ILinkAgent, @Req() req: Request) {
    return this.agencyService.linkAgent(data, req);
  }

  @Get('list')
  @UseGuards(AuthGuard)
  listAgencies(@Query() filters: IListAgencyFilters) {
    return this.agencyService.getAgencies(filters);
  }
}
