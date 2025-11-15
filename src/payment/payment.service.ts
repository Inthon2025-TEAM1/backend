import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async createPayment(parentId: number, payment: CreatePaymentDto) {
    const newPayment = this.paymentRepository.create({
      parentId,
      amount: payment.amount,
      depositorName: payment.depositorName,
      startAt: payment.startAt,
      endAt: payment.endAt,
    });
    return this.paymentRepository.save(newPayment);
  }
}
