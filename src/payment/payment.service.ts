import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { CreatePaymentDto } from './payment.dto';
import { User, UserRole } from 'src/user/user.entity';
import { isPast } from 'date-fns';

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
  async approvePayment(paymentId: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment request not found.');
    }
    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(
        'Payment request is not in PENDING status.',
      );
    }
    const children = await this.userRepository.find({
      where: { parentId: payment.parentId, role: UserRole.CHILD },
    });

    const updatedChildren = children.map((child) => {
      let renewalStart = child.expiresAt;
      if (!renewalStart || isPast(renewalStart)) {
        renewalStart = payment.startAt;
      }

      child.expiresAt = payment.endAt;
      return child;
    });

    await this.userRepository.save(updatedChildren);

    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date();

    await this.paymentRepository.save(payment);

    return {
      paymentId: payment.id,
      status: PaymentStatus.PAID,
      childrenUpdated: updatedChildren.length,
    };
  }
}
