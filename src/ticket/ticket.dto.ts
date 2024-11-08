import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ICreateTicketItem {
  @IsString()
  ticketReference: string;

  @IsString()
  flightNumber: string;

  @IsDateString()
  departureTime: string;

  @IsDateString()
  arrivalTime: string;

  @IsString()
  departureCity: string;

  @IsString()
  arrivalCity: string;

  @IsDateString()
  @IsOptional()
  returnDate: string;
}

export class IUpdateTicketItem {
  @IsNumber()
  ticketId: number;

  @IsString()
  ticketReference: string;

  @IsString()
  flightNumber: string;

  @IsDateString()
  departureTime: string;

  @IsDateString()
  arrivalTime: string;

  @IsString()
  departureCity: string;

  @IsString()
  arrivalCity: string;

  @IsDateString()
  @IsOptional()
  returnDate: string;
}

export class ICreateTicket {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ICreateTicketItem)
  tickets: ICreateTicketItem[];

  @IsString()
  agencySlug: string;

  @IsNumber()
  bookingId: number;
}

export class IUpdateTickets {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => IUpdateTicketItem)
  tickets: IUpdateTicketItem[];

  @IsString()
  agencySlug: string;

  @IsNumber()
  bookingId: number;
}

export class IRemoveTicket {
  @IsNumber()
  ticketId: number;

  @IsBoolean()
  moveToRecycleBin: boolean;

  @IsBoolean()
  restoreFromRecycleBin: boolean;

  @IsString()
  agencySlug: string;
}

export class ITicketListFilters {
  @IsString()
  agencySlug: string;

  @IsString()
  @IsOptional()
  isDeleted: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Math.max(1, parseInt(value)))
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Math.max(1, parseInt(value)))
  size: number = 5;
}

export class PermenantTicketDelete {
  @IsNumber()
  ticketId: number;

  @IsString()
  agencySlug: string;

  @IsString()
  code: string;
}

export class IUploadTicketMedia {
  @IsString()
  ticketId: string;

  @IsString()
  agencySlug: string;
}

export class IMessageTicket {
  @IsNumber()
  ticketId: number;

  @IsString()
  agencySlug: string;
}
