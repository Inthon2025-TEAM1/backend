import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentoringService } from './mentoring.service';
import { MentoringController } from './mentoring.controller';
import { MentoringRequest } from './mentoring-request.entity';
import { Mentor } from './mentor.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentoringRequest, Mentor]),
    AuthModule,
  ],
  providers: [MentoringService],
  controllers: [MentoringController],
})
export class MentoringModule {}
