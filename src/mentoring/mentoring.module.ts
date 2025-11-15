import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Mentor } from './mentor.entity';
import { MentoringRequest } from './mentoring-request.entity';
import { MentoringController } from './mentoring.controller';
import { MentoringService } from './mentoring.service';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringRequest, Mentor]), AuthModule],
  providers: [MentoringService],
  controllers: [MentoringController],
  exports: [MentoringService],
})
export class MentoringModule {}
