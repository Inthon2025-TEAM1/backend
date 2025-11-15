import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { FirebaseAuthGuard } from '../auth/firebase/firebase-auth.guard';

@Controller('chapter')
@UseGuards(FirebaseAuthGuard)
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get()
  async getChapters(@Query('gradeLevel') gradeLevel?: number) {
    if (gradeLevel) {
      return this.chapterService.getChaptersByGrade(gradeLevel);
    }
    return this.chapterService.getAllChapters();
  }
}
