import { Module } from '@nestjs/common';
import { MentoringService } from './mentoring.service';
import { MentoringController } from './mentoring.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentoringRequest } from './mentoring-request.entity';
import { UserModule } from '../user/user.module';
import { Mentor } from './mentor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringRequest, Mentor]), UserModule],
  providers: [MentoringService],
  controllers: [MentoringController],
})
export class MentoringModule {}
