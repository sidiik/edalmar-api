import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ICreateUser {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  address: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  is2faEnabled: boolean;

  @IsNumberString()
  @MinLength(9)
  phoneNumber: string;

  @IsNumberString()
  @MinLength(9)
  whatsappNumber: string;
}

export class IUpdateUser {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  address: string;

  @IsEmail()
  email: string;

  @IsNumberString()
  @MinLength(9)
  phoneNumber: string;

  @IsNumberString()
  @MinLength(9)
  whatsappNumber: string;

  @IsBoolean()
  is2faEnabled: boolean;

  @IsBoolean()
  markAsSuspended: boolean;

  @IsNumber()
  id: number;
}

export class IUserFilters {
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
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  whatsappNumber: string;

  @IsString()
  @IsOptional()
  agency_slug: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  isSuspended: string;
}
