import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { QuizAttempt } from '../quiz/quiz-attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, QuizAttempt])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
