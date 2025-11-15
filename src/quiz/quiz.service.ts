import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestion } from './quiz-question.entity';
import { QuizAttempt } from './quiz-attempt.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizQuestion)
    private quizRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
    private userService: UserService,
  ) {}

  // 챕터별 문제 가져오기
  async getQuestionsByChapter(chapterId: number): Promise<QuizQuestion[]> {
    return this.quizRepository.find({
      where: { chapterId },
      order: { id: 'ASC' },
    });
  }

  // 정답 제출 + 랜덤 보상
  async submitAnswer(
    childId: number,
    questionId: number,
    selectedAnswer: string,
  ): Promise<any> {
    const question = await this.quizRepository.findOne({ where: { id: questionId } });
    const isCorrect = question.answer === selectedAnswer;
    const rewardCandy = isCorrect ? Math.floor(Math.random() * 4) : 0; // 0~3 랜덤

    // 풀이 기록 저장
    const attempt = this.attemptRepository.create({
      childId,
      questionId,
      selectedAnswer,
      isCorrect,
      rewardCandy,
    });
    await this.attemptRepository.save(attempt);

    // 캔디 지급
    if (rewardCandy > 0) {
      await this.userService.updateCandy(childId, rewardCandy);
    }

    return {
      isCorrect,
      rewardCandy,
      explanation: isCorrect ? null : question.explanation,
    };
  }

  // 풀이 내역 조회
  async getAttempts(childId: number): Promise<QuizAttempt[]> {
    return this.attemptRepository.find({
      where: { childId },
      relations: ['question'],
      order: { createdAt: 'DESC' },
    });
  }
}
