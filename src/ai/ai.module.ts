import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { QuizModule } from '../quiz/quiz.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './ai.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), QuizModule],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
