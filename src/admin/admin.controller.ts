import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Get,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { MentoringService } from 'src/mentoring/mentoring.service';
import { QuizQuestionListDto } from 'src/quiz/quiz.dto';
import { QuizService } from 'src/quiz/quiz.service';
import { UserService } from 'src/user/user.service';
import { PaymentService } from 'src/payment/payment.service';
import { UpdateMentoringStatusDto } from 'src/mentoring/mentoring.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase/firebase-auth.guard';

@Controller('/admin')
@UseGuards(FirebaseAuthGuard)
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

  /** 결제 승인 */
  @Patch(':id/approve')
  async approvePayment(@Param('id', ParseIntPipe) paymentId: number) {
    return this.paymentService.approvePayment(paymentId);
  }

  /** 결제 승인 대기 목록 */
  @Get('pending-payments')
  async getPendingPayments() {
    return this.paymentService.findPendingPaymentsForAdmin();
  }

  /** 멘토링 신청 목록 */
  @Get('pending')
  async getPendingRequests() {
    return this.mentoringService.findPendingRequestsForAdmin();
  }

  /** 멘토링 신청 상태 업데이트 */
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMentoringStatusDto,
  ) {
    return this.mentoringService.adminUpdateStatus(id, updateDto.status);
  }
}
