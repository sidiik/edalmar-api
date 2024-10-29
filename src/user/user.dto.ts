import { agent_status, role } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// agency roles enum
export enum agency_role {
  agentManager = 'agent_manager',
  agent = 'agent',
}

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

export class IModifyUserStatus {
  @IsNumber()
  id: number;

  @IsBoolean()
  is2faEnabled: boolean;

  @IsBoolean()
  isSuspended: boolean;

  @IsEnum(role)
  role: role;
}

export class IModifyAgentStatus {
  @IsString()
  email: string;

  @IsEnum(agent_status)
  agentStatus: agent_status;

  @IsString()
  agencySlug: string;

  @IsEnum(agency_role)
  role: agency_role;
}
