import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTripDto {
  @IsString()
  title!: string;

  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
