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
import { ApplicationService } from './application.service';
import { AuthGuard } from 'guards/jwt.guard';
import { RolesGuard } from 'guards/authorize.guard';
import { role } from '@prisma/client';
import { Roles } from 'decorators/roles.decorator';
import {
  ICreateApplication,
  IGetApplicationDetails,
  IListApplications,
  IUpdateApplication,
} from './application.dto';
import { Request } from 'express';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async listApplications(
    @Query() data: IListApplications,
    @Req() req: Request,
  ) {
    return this.applicationService.listApplications(data, req.metadata);
  }

  @Get('details')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async applicationDetails(
    @Query() data: IGetApplicationDetails,
    @Req() req: Request,
  ) {
    return this.applicationService.getApplicationDetails(data, req.metadata);
  }

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async createApplication(
    @Body() data: ICreateApplication,
    @Req() req: Request,
  ) {
    return this.applicationService.createApplication(data, req.metadata);
  }

  @Put('update')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async updateApplication(
    @Body() data: IUpdateApplication,
    @Req() req: Request,
  ) {
    return this.applicationService.updateApplication(data, req.metadata);
  }
}
