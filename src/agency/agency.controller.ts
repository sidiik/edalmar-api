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
  IResetAgentPassword,
  IUpdateAgency,
  IUpdateAgencyKeys,
} from './agency.dto';
import { AgencyService } from './agency.service';
import { Request } from 'express';
import { RolesGuard } from 'guards/authorize.guard';
import { Roles } from 'decorators/roles.decorator';

@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  createAgency(@Body() data: ICreateAgency, @Req() req: Request) {
    return this.agencyService.createAgency(data, req);
  }

  @Put('update')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  updateAgency(@Body() data: IUpdateAgency, @Req() req: Request) {
    return this.agencyService.updateAgency(data, req);
  }

  @Put('update-keys')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  updateAgencyKeys(@Body() data: IUpdateAgencyKeys, @Req() req: Request) {
    return this.agencyService.upsertAgencyKeys(data, req.metadata);
  }

  @Post('link-agent')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  linkAgent(@Body() data: ILinkAgent, @Req() req: Request) {
    return this.agencyService.linkAgent(data, req);
  }

  @Post('reset-agent-password')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('agent_manager', 'admin')
  resetAgentPassword(@Body() data: IResetAgentPassword, @Req() req: Request) {
    return this.agencyService.resetAgentPassword(data, req.metadata);
  }

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  listAgencies(@Query() filters: IListAgencyFilters) {
    return this.agencyService.getAgencies(filters);
  }
}
