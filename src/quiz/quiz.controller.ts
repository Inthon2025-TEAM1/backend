import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  Req,
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
  async getQuestions(@Query('chapterId', ParseIntPipe) chapterId: number) {
    return this.quizService.getQuestionsByChapter(chapterId);
  }

  private mapDifficulty(grade: number): string {
    // 간단한 난이도 매핑 (필요시 수정)
    if (grade <= 2) return 'easy';
    if (grade <= 4) return 'medium';
    return 'hard';
  }

  @Get('unsolved')
  async getUnsolvedQuestions(
    @Req() req,
    @Query('chapterId') chapterId: number,
  ) {
    return this.quizService.getUnsolvedQuestionsByChapter(
      req.user.id,
      chapterId,
    );
  }

  @Get('chapters')
  async getChaptersByGrade(
    @Query('gradeLevel', ParseIntPipe) gradeLevel: number,
  ) {
    console.log(gradeLevel, 'gradeLevel received in controller');
    const array= await this.quizService.findChaptersByGrade(gradeLevel);
    return {
      data: array
    }
  }

  @Get('status')
  async getChapterStatus(
    @CurrentUserId() userId: number,
    @Query('chapterId', ParseIntPipe) chapterId: number,
  ) {
    const isCompleted = await this.quizService.checkChapterCompletion(
      userId,
      chapterId,
    );
    return { isCompleted };
  }

  @Post('submit')
  async submitAnswer(
    @CurrentUserId() userId: number,
    @Body('quizId') quizId: number,
    @Body('answer') answer: string,
  ) {
    console.log(
      '[Quiz Submit] User ID:',
      userId,
      '| Quiz ID:',
      quizId,
      '| Answer:',
      answer,
    );
    return this.quizService.submitAnswer(userId, quizId, answer);
  }

  @Get('attempts')
  async getAttempts(@CurrentUserId() userId: number) {
    return this.quizService.getAttempts(userId);
  }
}
