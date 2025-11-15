import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AiService, WeaknessAnalysisResponse } from './ai.service';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';

@Controller('ai')
@UseGuards(FirebaseAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('analyze-weakness')
  async analyzeWeakness(
    @Req() req,
  ): Promise<WeaknessAnalysisResponse> {
    return this.aiService.analyzeWeakness(req.user.id);
  }
}



