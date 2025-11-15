import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/firebase/firebase-auth.guard';
import { UserLoadInterceptor } from 'src/auth/interceptor/auth.interceptor';
import { CurrentUserId } from 'src/auth/decorators/current-user.decorator';
import { MentoringService } from './mentoring.service';
import { MentoringRequestDto } from './mentoring.dto';

@Controller('mentoring')
@UseGuards(FirebaseAuthGuard)
@UseInterceptors(UserLoadInterceptor)
export class MentoringController {
  constructor(private readonly mentoringService: MentoringService) {}

  @Post('request')
  async createMentoringRequest(
    @CurrentUserId() userId: number,
    @Body('request') request: MentoringRequestDto,
  ) {
    return this.mentoringService.createMentoringRequest(userId, request);
  }

  @Get('request')
  async getMentoringRequests(@CurrentUserId() userId: number) {
    return this.mentoringService.getMentoringRequestsByParentId(userId);
  }
}
