import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, In, Repository } from 'typeorm';
import { QuizQuestion } from './quiz-question.entity';
import { QuizAttempt } from './quiz-attempt.entity';
import { UserService } from '../user/user.service';
import { getRandomCandy } from 'src/util/candy.util';

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

  //챕터별 풀이 안한 문제 가져오기
  async getUnsolvedQuestionsByChapter(
    childId: number,
    chapterId: number,
  ): Promise<QuizQuestion[]> {
    // 이미 푼 문제 ID 목록 조회
    const attempts = await this.attemptRepository.find({
      where: { childId: childId },
      select: ['quizId'],
    });
    const attemptedQuizIds = attempts.map((a) => a.quizId);

    // 푼 문제를 제외하고 챕터별 문제 조회
    return this.quizRepository.find({
      where: {
        chapterId: chapterId,
        id: attemptedQuizIds.length > 0 ? Not(In(attemptedQuizIds)) : undefined,
      },
      order: { id: 'ASC' },
    });
  }

  // 정답 제출 + 랜덤 보상
  async submitAnswer(
    childId: number,
    quizId: number,
    selectedChoice: string,
  ): Promise<any> {
    const question = await this.quizRepository.findOne({
      where: { id: quizId },
    });
    if (!question) throw new NotFoundException('Question not found');
    const isCorrect = question.answer === selectedChoice;
    const rewardCandy = isCorrect ? getRandomCandy() : 0;

    // 풀이 기록 저장
    const attempt = this.attemptRepository.create({
      childId,
      quizId,
      selectedChoice,
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
      explanation: isCorrect ? null : question.explain,
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
