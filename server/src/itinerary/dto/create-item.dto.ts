import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  tripId!: string;
}
