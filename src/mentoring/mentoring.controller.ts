import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/firebase/firebase-auth.guard';
import { UserLoadInterceptor } from 'src/auth/interceptor/auth.interceptor';
import { CurrentUserId } from 'src/auth/decorators/current-user.decorator';
import { MentoringService } from './mentoring.service';
import { MentoringRequestDto, UpdateMentoringStatusDto } from './mentoring.dto';

@Controller('mentoring')
@UseGuards(FirebaseAuthGuard)
@UseInterceptors(UserLoadInterceptor)
export class MentoringController {
  constructor(private readonly mentoringService: MentoringService) {}

  @Post('applications')
  async createMentoringRequest(
    @CurrentUserId() userId: number,
    @Body() request: MentoringRequestDto,
  ) {
    return this.mentoringService.createMentoringRequest(userId, request);
  }

  @Get('applications')
  async getMentoringRequests(@CurrentUserId() userId: number) {
    return this.mentoringService.getMentoringRequestsByParentId(userId);
  }

  @Get('applications/:id')
  async getMentoringRequest(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.mentoringService.getMentoringRequestById(id, userId);
  }

  @Delete('applications/:id')
  async cancelMentoringRequest(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.mentoringService.cancelMentoringRequest(id, userId);
  }

  @Patch('applications/:id/status')
  async updateMentoringStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMentoringStatusDto,
  ) {
    return this.mentoringService.updateMentoringStatus(id, updateDto);
  }

 
}
