import { otp_reoson } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class ISignIn {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  password: string;

  @IsString()
  agency_slug: string;
}

export class IVerifyOTP {
  @IsString()
  @MinLength(6)
  otp: string;

  @IsNumber()
  identity: number;
}

export class OTPReason {
  @IsEnum(otp_reoson)
  reason: otp_reoson;
}
