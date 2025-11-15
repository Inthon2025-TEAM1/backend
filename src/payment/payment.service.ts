import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './payment.dto';
import { User, UserRole } from 'src/user/user.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createPayment(parentId: number, payment: CreatePaymentDto) {
    const PRICE_PER_CHILD = 9900;
    const childrenCount = await this.userRepository.count({
      where: { parentId, role: UserRole.CHILD },
    });

    if (childrenCount * PRICE_PER_CHILD > payment.amount) {
      throw new BadRequestException('Invalid amount');
    }
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
