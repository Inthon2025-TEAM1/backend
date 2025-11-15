import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePaymentDto } from './payment.dto';
import { PaymentService } from './payment.service';
import { FirebaseAuthGuard } from 'src/auth/firebase/firebase-auth.guard';
import { UserLoadInterceptor } from 'src/auth/interceptor/auth.interceptor';
import { CurrentUserId } from 'src/auth/decorators/current-user.decorator';

@Controller('payment')
@UseGuards(FirebaseAuthGuard)
@UseInterceptors(UserLoadInterceptor)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(
    @CurrentUserId() userId: number,
    @Body('payment') payment: CreatePaymentDto,
  ) {
    return this.paymentService.createPayment(userId, payment);
  }
}
