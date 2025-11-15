import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { QuizModule } from 'src/quiz/quiz.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { MentoringModule } from 'src/mentoring/mentoring.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [QuizModule, UserModule, AuthModule, MentoringModule, PaymentModule],
  controllers: [AdminController],
})
export class AdminModule {}
