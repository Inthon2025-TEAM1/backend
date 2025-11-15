import { Body, Controller, Post } from '@nestjs/common';
import { QuizQuestionListDto } from 'src/quiz/quiz.dto';
import { QuizService } from 'src/quiz/quiz.service';

@Controller('/api/admin')
export class AdminController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create-quiz')
  async createQuiz(@Body() quiz: QuizQuestionListDto) {
    return this.quizService.createQuiz(quiz.quizs);
  }
}
