import {
  Body,
  Controller,
  Get,
  Param,
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
import { role } from '@prisma/client';
import { IModifyAgentStatus } from 'src/user/user.dto';

@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin)
  createAgency(@Body() data: ICreateAgency, @Req() req: Request) {
    return this.agencyService.createAgency(data, req);
  }

  @Put('update')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin)
  updateAgency(@Body() data: IUpdateAgency, @Req() req: Request) {
    return this.agencyService.updateAgency(data, req);
  }

  @Put('update-keys')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin)
  updateAgencyKeys(@Body() data: IUpdateAgencyKeys, @Req() req: Request) {
    return this.agencyService.upsertAgencyKeys(data, req.metadata);
  }

  @Post('link-agent')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin)
  linkAgent(@Body() data: ILinkAgent, @Req() req: Request) {
    return this.agencyService.linkAgent(data, req);
  }

  @Get('list-agents/:agencySlug')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_manager)
  listAgents(@Param('agencySlug') agencySlug: string, @Req() req: Request) {
    return this.agencyService.getAgents(agencySlug, req.metadata);
  }

  @Put('modify-agent-status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_manager)
  modifyAgentStatus(@Body() data: IModifyAgentStatus, @Req() req: Request) {
    return this.agencyService.modifyAgentStatus(data, req.metadata);
  }

  @Post('reset-agent-password')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('agent_manager', 'admin')
  resetAgentPassword(@Body() data: IResetAgentPassword, @Req() req: Request) {
    return this.agencyService.resetAgentPassword(data, req.metadata);
  }

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin)
  listAgencies(@Query() filters: IListAgencyFilters) {
    return this.agencyService.getAgencies(filters);
  }
}
