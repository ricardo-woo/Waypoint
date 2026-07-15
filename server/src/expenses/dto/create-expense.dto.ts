import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  label!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  tripId!: string;
}
