import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User]), AuthModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
