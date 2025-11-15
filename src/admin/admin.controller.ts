import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Get,
  Post,
  Patch,
} from '@nestjs/common';
import { MentoringService } from 'src/mentoring/mentoring.service';
import { QuizQuestionListDto } from 'src/quiz/quiz.dto';
import { QuizService } from 'src/quiz/quiz.service';
import { UserService } from 'src/user/user.service';
import { PaymentService } from 'src/payment/payment.service';

@Controller('/api/admin')
export class AdminController {
  constructor(
    private readonly quizService: QuizService,
    private readonly userService: UserService,
    private readonly mentoringService: MentoringService,
    private readonly paymentService: PaymentService,
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

  @Get('get-all-quizzes')
  async getAllQuizzes() {
    return this.quizService.getAllAttempts();
  }

  @Post('create-mentor-mockup')
  async createMentorRequestAndMentor() {
    return this.mentoringService.createMentorMockup();
  }

  @Patch(':id/approve')
  async approvePayment(@Param('id', ParseIntPipe) paymentId: number) {
    return this.paymentService.approvePayment(paymentId);
  }
}
