import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';

@Controller('quiz')
@UseGuards(FirebaseAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getQuestions(@Query('chapterId') chapterId: number) {
    return this.quizService.getQuestionsByChapter(chapterId);
  }

  @Post('submit')
  async submitAnswer(
    @Req() req,
    @Body('questionId') questionId: number,
    @Body('answer') answer: string,
  ) {
    return this.quizService.submitAnswer(req.user.id, questionId, answer);
  }

  @Get('attempts')
  async getAttempts(@Req() req) {
    return this.quizService.getAttempts(req.user.id);
  }
}
