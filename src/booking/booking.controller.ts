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
import { BookingService } from './booking.service';
import {
  IBookingFilters,
  ICreateBooking,
  IGetBooking,
  IUpdateBooking,
} from './booking.dto';
import { Request } from 'express';
import { AuthGuard } from 'guards/jwt.guard';
import { RolesGuard } from 'guards/authorize.guard';
import { Roles } from 'decorators/roles.decorator';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'agent', 'agent_manager')
  createBooking(@Body() data: ICreateBooking, @Req() req: Request) {
    return this.bookingService.createBooking(data, req.metadata);
  }

  @Put('update')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'agent', 'agent_manager')
  updateBooking(@Body() data: IUpdateBooking, @Req() req: Request) {
    return this.bookingService.updateBooking(data, req.metadata);
  }

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'agent', 'agent_manager')
  listBookings(@Query() filters: IBookingFilters, @Req() req: Request) {
    return this.bookingService.listBookings(filters, req.metadata);
  }

  @Get('details')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'agent', 'agent_manager')
  getBookingDetails(@Query() filters: IGetBooking, @Req() req: Request) {
    return this.bookingService.getBooking(filters, req.metadata);
  }
}
