import { Module } from '@nestjs/common';
import { MentoringService } from './mentoring.service';
import { MentoringController } from './mentoring.controller';

@Module({
  providers: [MentoringService],
  controllers: [MentoringController],
})
export class MentoringModule {}
