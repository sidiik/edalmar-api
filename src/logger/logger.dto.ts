import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ILog {
  @IsNumber()
  user_id: number;
  @IsString()
  action: string;
  @IsString()
  body: string;
  @IsString()
  @IsOptional()
  description: string;
  metadata: any;
}
