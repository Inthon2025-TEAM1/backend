import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuizQuestion } from './quiz-question.entity';
import { QuizAttempt } from './quiz-attempt.entity';
import { Chapter } from './chapter.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionGuard } from 'src/auth/guards/subscription.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizQuestion, QuizAttempt, Chapter]),
    UserModule,
    AuthModule,
  ],
  providers: [QuizService, SubscriptionGuard],
  controllers: [QuizController],
  exports: [QuizService],
})
export class QuizModule {}
