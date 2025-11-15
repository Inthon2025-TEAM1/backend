import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './chapter.entity';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
  ) {}

  async getChaptersByGrade(gradeLevel: number): Promise<Chapter[]> {
    return this.chapterRepository.find({
      where: { gradeLevel },
      order: { chapterOrder: 'ASC' },
    });
  }

  async getAllChapters(): Promise<Chapter[]> {
    return this.chapterRepository.find({
      order: { gradeLevel: 'ASC', chapterOrder: 'ASC' },
    });
  }
}
