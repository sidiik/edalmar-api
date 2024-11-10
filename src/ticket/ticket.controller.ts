import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthGuard } from 'guards/jwt.guard';
import { RolesGuard } from 'guards/authorize.guard';
import { Roles } from 'decorators/roles.decorator';
import { role } from '@prisma/client';
import {
  ICreateTicket,
  IMessageTicket,
  IRemoveTicket,
  ITicketListFilters,
  IUpdateTickets,
  IUploadTicketMedia,
} from './ticket.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async createTicket(@Body() data: ICreateTicket, @Req() req: Request) {
    return this.ticketService.createTicket(data, req.metadata);
  }

  @Put('update')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async updateTicket(@Body() data: IUpdateTickets, @Req() req: Request) {
    return this.ticketService.updateTicket(data, req.metadata);
  }

  @Post('remove')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async removeTicket(@Body() data: IRemoveTicket, @Req() req: Request) {
    return this.ticketService.removeTicket(data, req.metadata);
  }

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async listTickets(@Query() filters: ITicketListFilters, @Req() req: Request) {
    return this.ticketService.listTickets(filters, req.metadata);
  }

  @Post('upload')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  @UseInterceptors(FileInterceptor('file'))
  async uploadTicketFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: IUploadTicketMedia,
    @Req() req: Request,
  ) {
    return this.ticketService.uploadTicketMedia(file, data, req.metadata);
  }

  @Post('message')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(role.admin, role.agent_user)
  async sendMessage(@Body() data: IMessageTicket, @Req() req: Request) {
    return this.ticketService.messageTicket(data, req.metadata);
  }
}
