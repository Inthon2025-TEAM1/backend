import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { QuizModule } from './quiz/quiz.module';
import { PaymentModule } from './payment/payment.module';
import { MentoringModule } from './mentoring/mentoring.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { RewardModule } from './reward/reward.module';
import { CandyTransaction } from './candy-transaction/candy-transaction.entity';
import { CandyTransactionModule } from './candy-transaction/candy-transaction.module';
import { AdminModule } from './admin/admin.module';
import { QuizQuestion } from './quiz/quiz-question.entity';
import { QuizAttempt } from './quiz/quiz-attempt.entity';
import { Chapter } from './quiz/chapter.entity';
import { Payment } from './payment/payment.entity';
import { MentoringRequest } from './mentoring/mentoring-request.entity';
import { Mentor } from './mentoring/mentor.entity';
import { Reward } from './reward/reward.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    QuizModule,
    PaymentModule,
    MentoringModule,
    TypeOrmModule.forRoot({
      type: 'mysql', // MariaDB는 typeorm에서 mysql 타입을 사용함
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT), // MariaDB 기본 3306
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [
        User,
        CandyTransaction,
        QuizQuestion,
        QuizAttempt,
        Chapter,
        Payment,
        MentoringRequest,
        Mentor,
        Reward,
      ],
      synchronize: true, // 개발환경에서는 true, 운영은 false
      charset: 'utf8mb4', // 이모지 지원
    }),
    RewardModule,
    CandyTransactionModule,
    AdminModule,
    QuizModule,
    PaymentModule,
    MentoringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
