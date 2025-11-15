import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  parentId: number;

  @IsInt()
  amount: number;

  @IsString()
  @IsNotEmpty()
  depositorName: string;

  @IsDateString()
  @IsOptional()
  startAt?: Date;

  @IsDateString()
  @IsOptional()
  endAt?: Date;
}
