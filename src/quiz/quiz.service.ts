import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRandomCandy } from 'src/util/candy.util';
import { In, Not, Repository, MoreThanOrEqual } from 'typeorm';
import { UserService } from '../user/user.service';
import { Chapter } from './chapter.entity';
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
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
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
  async findChaptersByGrade(
    gradeLevel: number,
  ): Promise<{ id: number; chapterName: string; chapterOrder: number }[]> {
    return this.chapterRepository.find({
      select: ['id', 'chapterName', 'chapterDescription', 'chapterOrder'],
      where: { gradeLevel: gradeLevel },
      order: { chapterOrder: 'ASC' },
    });
  }

  async checkChapterCompletion(
    childId: number,
    chapterId: number,
  ): Promise<boolean> {
    const attempts = await this.attemptRepository.find({
      where: { childId: childId },
      select: ['quizId'],
    });
    const attemptedQuizIds = attempts.map((a) => a.quizId);

    const query = this.quizRepository.createQueryBuilder('question');

    query
      .select('question.id')
      .where('question.chapterId = :chapterId', { chapterId });

    if (attemptedQuizIds.length > 0) {
      query.andWhere('question.id NOT IN (:...ids)', { ids: attemptedQuizIds });
    }

    const unsolvedQuestion = await query.getOne();

    // 안 푼 문제가 없으면(null) -> 완료(true)
    return unsolvedQuestion === null;
  }

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
      await this.userService.incrementCandy(childId, rewardCandy);
    }

    return {
      isCorrect,
      rewardCandy,
      explanation: isCorrect ? null : question.explain,
    };
  }

  // 풀이 내역 조회
  async getAttemptsById(childId: number, lastMonthOnly: boolean = false): Promise<QuizAttempt[]> {
    const whereCondition: any = { childId };
    
    // 한 달 치 데이터만 가져오기
    if (lastMonthOnly) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      whereCondition.createdAt = MoreThanOrEqual(oneMonthAgo);
    }
    
    return this.attemptRepository.find({
      where: whereCondition,
      relations: ['quiz', 'quiz.chapter'],
      order: { createdAt: 'DESC' },
    });
  }

  // 문제 ID로 문제 조회
  async getQuestionById(quizId: number): Promise<QuizQuestion | null> {
    return this.quizRepository.findOne({
      where: { id: quizId },
    });
  }

  async getAllAttempts(): Promise<QuizAttempt[]> {
    return this.attemptRepository.find({
      relations: ['quiz'],
      order: { createdAt: 'DESC' },
    });
  }
}
