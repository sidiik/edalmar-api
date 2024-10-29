import {
  IsBoolean,
  IsDate,
  IsNumber,
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

  @IsDate()
  @IsOptional()
  dob: string;

  @IsString()
  agencySlug: string;

  @IsString()
  nationality: string;

  @IsBoolean()
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

    @IsString()
    @IsOptional()

}