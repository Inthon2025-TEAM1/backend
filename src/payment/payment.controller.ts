import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreatePaymentDto } from './payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Req() req, @Body('payment') payment: CreatePaymentDto) {
    return this.paymentService.createPayment(req.user.id, payment);
  }
}
