import { agent_status } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ICreateAgency {
  @IsString()
  agencyName: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;
}

export class IUpdateAgency {
  @IsString()
  agencyName: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsNumber()
  agencyId: number;
}

export class IUpdateAgencyKeys {
  @IsString()
  twilioSid: string;

  @IsString()
  twilioAuthToken: string;

  @IsString()
  twilioPhoneNumber: string;

  @IsString()
  whatsappAuthToken: string;

  @IsNumber()
  agencyId: number;
}

export class IAddAgent {
  @IsEnum(agent_status)
  status: agent_status;

  @IsNumber()
  user_id: number;

  @IsString()
  agencySlug: string;
}

export class IListAgencyFilters {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  agency_disabled: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Math.max(1, parseInt(value)))
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Math.max(1, parseInt(value)))
  size: number = 5;
}

export class ILinkAgent {
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  agencySlug: string;

  @IsEnum(agent_status)
  agent_status: agent_status;
}
