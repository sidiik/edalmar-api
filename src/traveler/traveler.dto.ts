import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ICreateTraveler {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(9)
  phone: string;

  @IsString()
  @MinLength(9)
  whatsappNumber: string;

  @IsDateString()
  @IsOptional()
  dob: string;

  @IsString()
  agencySlug: string;

  @IsString()
  nationality: string;

  @IsBoolean()
  @IsOptional()
  notificationsEnabled: boolean;
}

export class IUpdateTraveler {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(9)
  phone: string;

  @IsString()
  @MinLength(9)
  whatsappNumber: string;

  @IsDate()
  @IsOptional()
  dob: string;

  @IsString()
  agencySlug: string;

  @IsString()
  nationality: string;

  @IsBoolean()
  notificationsEnabled: boolean;

  @IsNumber()
  travelerId: number;
}

export class IListTravelersFilters {
  @IsString()
  agencySlug: string;

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
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  whatsappNumber: string;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;
}

export class IGetTraveler {
  @IsNumberString()
  travelerId: string;

  @IsString()
  agencySlug: string;
}
