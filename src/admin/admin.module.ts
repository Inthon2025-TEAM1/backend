import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { QuizModule } from 'src/quiz/quiz.module';

@Module({
  imports: [QuizModule],
  controllers: [AdminController],
})
export class AdminModule {}
