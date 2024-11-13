import { booking_status } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export enum IncludeBooking {
  traveler = 'traveler',
  tickets = 'tickets',
  all = 'all',
}

export class ICreateBooking {
  @IsNumber()
  travelerId: number;

  @IsString()
  agencySlug: string;

  @IsString()
  bookingDescription: string;
}

export class IUpdateBooking {
  @IsNumber()
  bookingId: number;

  @IsNumber()
  travelerId: number;

  @IsEnum(booking_status)
  bookingStatus: booking_status;

  @IsString()
  agencySlug: string;

  @IsString()
  bookingDescription: string;
}

export class IBookingFilters {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Math.max(1, parseInt(value)))
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Math.max(1, parseInt(value)))
  size: number = 5;

  @IsString()
  @IsOptional()
  travelerPhone: string;

  @IsString()
  @IsOptional()
  travelerId: string;

  @IsEnum(IncludeBooking)
  @IsOptional()
  include: IncludeBooking;

  @IsString()
  @IsOptional()
  whatsappPhoneNumber: string;

  @IsString()
  agencySlug: string;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;
}

export class ICreateTicket {
  @IsString()
  ticket_reference: string;

  @IsNumber()
  booking_id: number;

  @IsString()
  departureCity: string;

  @IsString()
  arrivalCity: string;

  @IsString()
  departureTime: string;

  @IsString()
  arrivalTime: string;

  @IsString()
  seatNumber: string;

  @IsString()
  flightNumber: string;

  @IsString()
  @IsOptional()
  returnDate: string;
}

export class IGetBooking {
  @IsNumberString()
  bookingId: number;

  @IsString()
  agencySlug: string;
}
