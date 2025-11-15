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
  async getQuestions(
    @Query('chapterId') chapterId: string,
    @Query('grade') grade?: string,
    @Query('subject') subject?: string,
    @Query('schoolLevel') schoolLevel?: string,
    @Query('quizId') quizId?: string,
  ) {
    const chapterIdNum = parseInt(chapterId, 10);

    if (isNaN(chapterIdNum)) {
      return {
        quizId: quizId || 'default',
        title: subject || '퀴즈',
        questions: [],
      };
    }

    const questions =
      await this.quizService.getQuestionsByChapter(chapterIdNum);

    // 프론트엔드가 기대하는 형식으로 변환
    return {
      quizId: quizId || chapterId || 'default',
      title: subject || '퀴즈',
      questions: questions.map((q) => ({
        id: q.id.toString(),
        question:
          typeof q.question === 'string'
            ? q.question
            : JSON.stringify(q.question),
        answer: q.answer,
        explanation: q.explain,
        difficulty: this.mapDifficulty(q.grade),
        choices: q.choices || [],
      })),
    };
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
    return this.quizService.findChaptersByGrade(gradeLevel);
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
