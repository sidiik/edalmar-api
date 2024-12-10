import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ICreateTicketItem {
  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  ticketReference: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  flightNumber: string;

  @IsDateString()
  departureTime: string;

  @IsDateString()
  arrivalTime: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  departureCity: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  arrivalCity: string;

  @IsDateString()
  @IsOptional()
  returnDate: string;
}

export class IUpdateTicketItem {
  @IsNumber()
  ticketId: number;

  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  ticketReference: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  flightNumber: string;

  @IsDateString()
  departureTime: string;

  @IsDateString()
  arrivalTime: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  departureCity: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
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
  travelerId: number;
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
  travelerId: number;
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

  @IsNumberString()
  @IsOptional()
  travelerId: string;

  @IsString()
  @IsOptional()
  isDeleted: string;

  @IsString()
  @IsOptional()
  travelerPhone: string;

  @IsString()
  @IsOptional()
  whatsappNumber: string;

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
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;

  @IsString()
  @IsOptional()
  departureDate: string;
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
