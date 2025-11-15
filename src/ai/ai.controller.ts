import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AiService, WeaknessAnalysisResponse } from './ai.service';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';

@Controller('ai')
@UseGuards(FirebaseAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('analyze-weakness')
  async analyzeWeakness(
    @Req() req,
    @Query('childId') childId?: string,
  ): Promise<WeaknessAnalysisResponse> {
    // If childId is provided, use it; otherwise use the logged-in user's ID
    const targetUserId = childId ? parseInt(childId, 10) : req.user.id;
    return this.aiService.analyzeWeakness(targetUserId);
  }
}
