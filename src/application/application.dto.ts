import { application_status, application_type } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ApplicationPriority {
  'all' = 'all',
  'overdue' = 'overdue',
  'urgent' = 'urgent',
  'normal' = 'normal',
  'low' = 'low',
}

export enum ApplicationType {
  'all' = 'all',
  'visa' = 'visa',
  'passport' = 'passport',
  'certificate' = 'certificate',
}

export enum ApplicationStatus {
  'all' = 'all',
  'pending' = 'pending',
  'approved' = 'approved',
  'rejected' = 'rejected',
}

export class ICreateApplication {
  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  applicationReference: string;

  @IsString()
  metadata: string;

  @IsEnum(application_type)
  applicationType: application_type;

  @IsEnum(application_status)
  applicationStatus: application_status;

  @IsString()
  agencySlug: string;

  @IsNumber()
  travelerId: number;

  @IsDateString()
  notificationDue: string;
}

export class IUpdateApplication {
  @IsNumber()
  applicationId: number;

  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  applicationReference: string;

  @IsString()
  metadata: string;

  @IsEnum(application_type)
  applicationType: application_type;

  @IsEnum(application_status)
  applicationStatus: application_status;

  @IsString()
  agencySlug: string;

  @IsNumber()
  travelerId: number;

  @IsDateString()
  notificationDue: string;
}

export class IListApplications {
  @IsString()
  agencySlug: string;

  @IsNumberString()
  @IsOptional()
  travelerId: string;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  applicationStatus: ApplicationStatus;

  @IsString()
  @IsOptional()
  travelerPhone: string;

  @IsString()
  @IsOptional()
  whatsappNumber: string;

  @IsEnum(ApplicationType)
  @IsOptional()
  applicationType: ApplicationType;

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

  @IsEnum(ApplicationPriority)
  @IsOptional()
  priority: ApplicationPriority;
}

export class IGetApplicationDetails {
  @IsNumberString()
  applicationId: string;

  @IsString()
  agencySlug: string;
}
