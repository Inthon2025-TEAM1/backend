import { PaymentStatus } from './payment.entity';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
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
