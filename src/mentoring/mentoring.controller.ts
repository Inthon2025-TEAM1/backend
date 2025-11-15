import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/firebase/firebase-auth.guard';
import { MentoringService } from './mentoring.service';
import { MentoringRequestDto } from './mentoring.dto';

@Controller('mentoring')
@UseGuards(FirebaseAuthGuard)
export class MentoringController {
  constructor(private readonly mentoringService: MentoringService) {}

  @Post('request')
  async createMentoringRequest(
    @Req() req,
    @Body('request') request: MentoringRequestDto,
  ) {
    return this.mentoringService.createMentoringRequest(req.user.id, request);
  }

  @Get('request')
  async getMentoringRequests(@Req() req) {
    return this.mentoringService.getMentoringRequestsByParentId(req.user.id);
  }
}
