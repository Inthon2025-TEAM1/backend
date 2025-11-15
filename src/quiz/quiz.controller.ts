import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';
import { UserLoadInterceptor } from '../auth/interceptor/auth.interceptor';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@Controller('quiz')
@UseGuards(FirebaseAuthGuard)
@UseInterceptors(UserLoadInterceptor)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getQuestions(@Query('chapterId') chapterId: number) {
    return this.quizService.getQuestionsByChapter(chapterId);
  }

  @Post('submit')
  async submitAnswer(
    @CurrentUserId() userId: number,
    @Body('quizId') quizId: number,
    @Body('answer') answer: string,
  ) {
    return this.quizService.submitAnswer(userId, quizId, answer);
  }

  @Get('attempts')
  async getAttempts(@CurrentUserId() userId: number) {
    return this.quizService.getAttempts(userId);
  }
}
