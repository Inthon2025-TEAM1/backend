import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuizQuestionListDto } from 'src/quiz/quiz.dto';
import { QuizService } from 'src/quiz/quiz.service';
import { UserService } from 'src/user/user.service';

@Controller('/api/admin')
export class AdminController {
  constructor(
    private readonly quizService: QuizService,
    private readonly userService: UserService,
  ) {}

  @Post('create-quiz')
  async createQuiz(@Body() quiz: QuizQuestionListDto) {
    return this.quizService.createQuiz(quiz.quizs);
  }

  @Post('increment-candy')
  async incrementCandy(@Body() body: { userId: number; amount: number }) {
    return this.userService.incrementCandy(body.userId, body.amount);
  }

  @Get('get-all-users')
  async getAllUsers() {
    return this.userService.getUsers();
  }
}
