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
import { TravelerService } from './traveler.service';
import { AuthGuard } from 'guards/jwt.guard';
import { RolesGuard } from 'guards/authorize.guard';
import { Roles } from 'decorators/roles.decorator';
import {
  ICreateTraveler,
  IListTravelersFilters,
  IUpdateTraveler,
} from './traveler.dto';
import { Request } from 'express';
import { role } from '@prisma/client';

@Controller('traveler')
export class TravelerController {
  constructor(private readonly travelerService: TravelerService) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async createTraveler(@Body() data: ICreateTraveler, @Req() req: Request) {
    return await this.travelerService.createTraveler(data, req.metadata);
  }

  @Put('update')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async updateTraveler(@Body() data: IUpdateTraveler, @Req() req: Request) {
    return await this.travelerService.updateTraveler(data, req.metadata);
  }

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async listTravelers(
    @Query() data: IListTravelersFilters,
    @Req() req: Request,
  ) {
    return await this.travelerService.listTravelers(data, req.metadata);
  }
}
