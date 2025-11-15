import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRandomCandy } from 'src/util/candy.util';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { QuizAttempt } from './quiz-attempt.entity';
import { QuizQuestion, QuizType } from './quiz-question.entity';
import { QuizQuestionDto } from './quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizQuestion)
    private quizRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
    private userService: UserService,
  ) {}

  async createQuiz(quizList: QuizQuestionDto[]) {
    // entity로 create 하고 create Many
    const quizEntities = quizList.map((quizDto) =>
      this.quizRepository.create({
        grade: quizDto.grade,
        type: quizDto.type as QuizType,
        chapterId: quizDto.chapterId,
        question: quizDto.question,
        choices: quizDto.choices,
        answer: quizDto.answer,
        explain: quizDto.explain,
      }),
    );
    await this.quizRepository.save(quizEntities);
    return quizEntities;
  }

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
